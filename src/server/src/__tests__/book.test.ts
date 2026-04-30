import { describe, expect, it, afterAll, beforeAll, jest } from '@jest/globals';
import request from 'supertest';

import { prisma } from '../lib/prisma';

import testServer from './app';
import { createAuthor, MOCK_AUTHOR_ID } from './wishlist.factory';

describe('Book Service Tests', () => {
  jest.setTimeout(15000);

  beforeAll(async () => {
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();

    await createAuthor();
  });
  afterAll(async () => {
    await prisma.loan.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.$disconnect();
  });

  // --- OPERAÇÃO 1: REGISTRO (POST) ---
  describe('POST /api/books/register', () => {
    it('deve registrar um livro com sucesso', async () => {
      const res = await request(testServer).post('/api/books/register').send({
        isbn: '9780132350884',
        name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        year: 2008,
        authorId: MOCK_AUTHOR_ID,
        description: 'Noted software expert Robert C. Martin presents a revolutionary paradigm...',
        categories: 'Programming, Agile',
        totalQuantity: 5,
        availableQuantity: 5,
      });

      expect(res.status).toBe(201);
      expect(res.body.data).toContain('Livro criado com sucesso');

      // Verifica se a imagem foi buscada na OpenLibrary
      const book = await prisma.book.findUnique({ where: { isbn: '9780132350884' } });
      expect(book?.imageSrc).toBeDefined();
      expect(book?.imageSrc).toMatch(/^https?:\/\/.*openlibrary\.org\/.*$/);
    });

    it('deve registrar um livro com imageSrc manual ignorando a busca automática', async () => {
      const res = await request(testServer).post('/api/books/register').send({
        isbn: '9780132350885',
        name: 'Manual Image Book',
        year: 2024,
        authorId: MOCK_AUTHOR_ID,
        description: 'Testing manual override',
        categories: 'Test',
        totalQuantity: 1,
        availableQuantity: 1,
        imageSrc: 'https://example.com/manual-cover.jpg',
      });

      expect(res.status).toBe(201);
      const book = await prisma.book.findUnique({ where: { isbn: '9780132350885' } });
      expect(book?.imageSrc).toBe('https://example.com/manual-cover.jpg');
    });

    it('deve retornar 401 VALIDATION_ERROR se a quantidade disponível for maior que a total', async () => {
      const res = await request(testServer).post('/api/books/register').send({
        isbn: 'ISBN-ERROR',
        name: 'Error Book',
        year: 2024,
        authorId: MOCK_AUTHOR_ID,
        description: 'Should fail',
        categories: 'Test',
        totalQuantity: 5,
        availableQuantity: 10,
      });

      expect(res.status).toBe(401);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });
  });

  // --- OPERAÇÃO 2: SELEÇÃO (GET) ---
  describe('GET /api/books', () => {
    it('deve listar os livros cadastrados', async () => {
      const res = await request(testServer).get('/api/books');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('deve filtrar livros por nome', async () => {
      const res = await request(testServer).get('/api/books').query({ name: 'Clean Code' });

      expect(res.status).toBe(200);
      expect(res.body.data[0].name).toContain('Clean Code');
    });
  });

  describe('GET /api/books/id/:id', () => {
    it('deve buscar um livro pelo ID', async () => {
      const list = await request(testServer).get('/api/books');
      const bookId = list.body.data[0].id;

      const res = await request(testServer).get(`/api/books/id/${bookId}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(bookId);
    });

    it('deve retornar 404 para ID inexistente', async () => {
      const res = await request(testServer).get('/api/books/id/0c90a069-3a1f-4888-94af-c798f6f07d0a');
      expect(res.status).toBe(404);
    });
  });

  // --- OPERAÇÃO 3: ATUALIZAÇÃO (PUT) ---
  describe('PUT /api/books/:id', () => {
    it('deve atualizar o nome de um livro e seu slug correspondente', async () => {
      const list = await request(testServer).get('/api/books');
      const bookId = list.body.data[0].id;

      const res = await request(testServer).put(`/api/books/${bookId}`).send({
        name: 'Clean Code - Updated Edition',
      });

      expect(res.status).toBe(202);
      expect(res.body.data).toContain('Livro atualizado com sucesso');
    });

    it('deve buscar uma nova capa se o ISBN for atualizado', async () => {
      const list = await request(testServer).get('/api/books');
      const bookId = list.body.data[0].id;

      // Primeiro garante que o livro tem uma imagem (ou limpa ela)
      await prisma.book.update({ where: { id: bookId }, data: { imageSrc: null } });

      const res = await request(testServer).put(`/api/books/${bookId}`).send({
        isbn: '9780596007126', // Head First Design Patterns
      });

      expect(res.status).toBe(202);
      const updatedBook = await prisma.book.findUnique({ where: { id: bookId } });
      expect(updatedBook?.isbn).toBe('9780596007126');
      expect(updatedBook?.imageSrc).toMatch(/^https?:\/\/.*openlibrary\.org\/.*$/);
    });
  });

  // --- OPERAÇÃO 4: DELEÇÃO (DELETE) ---
  describe('DELETE /api/books/:id', () => {
    it('deve remover um livro com sucesso', async () => {
      const list = await request(testServer).get('/api/books');
      const bookId = list.body.data[0].id;

      const res = await request(testServer).delete(`/api/books/${bookId}`);

      expect(res.status).toBe(202);
      expect(res.body.data).toContain('Livro deletado com sucesso');

      const check = await request(testServer).get(`/api/books/id/${bookId}`);
      expect(check.status).toBe(404);
    });
  });
});
