import { describe, expect, it, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';

import { prisma } from '../lib/prisma';
import testServer from './server.test';
import { createAuthor, MOCK_AUTHOR_ID } from './book.factory';

describe('Book Service Tests', () => {
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

  describe('POST /api/books/register', () => {
    it('deve registrar um livro com sucesso', async () => {
      const res = await request(testServer)
        .post('/api/books/register')
        .send({
          isbn: '9780132350884',
          name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
          year: 2008,
          authorId: MOCK_AUTHOR_ID,
          description: 'Noted software expert Robert C. Martin presents a revolutionary paradigm...',
          categories: ['Programming', 'Agile'],
          totalQuantity: 5,
          availableQuantity: 5,
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toContain('criado com sucesso');
    });

    it('deve retornar 401 VALIDATION_ERROR se a quantidade disponível for maior que a total', async () => {
      const res = await request(testServer)
        .post('/api/books/register')
        .send({
          isbn: 'ISBN-ERROR',
          name: 'Error Book',
          year: 2024,
          authorId: MOCK_AUTHOR_ID,
          description: 'Should fail',
          categories: ['Test'],
          totalQuantity: 5,
          availableQuantity: 10,
        });

      expect(res.status).toBe(401);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });
  });

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

  describe('PUT /api/books/:id', () => {
    it('deve atualizar o nome de um livro e seu slug correspondente', async () => {
      const list = await request(testServer).get('/api/books');
      const bookId = list.body.data[0].id;

      const res = await request(testServer).put(`/api/books/${bookId}`).send({
        name: 'Clean Code - Updated Edition',
      });

      expect(res.status).toBe(200);
      expect(res.body.data).toContain('atualizados com sucesso');
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('deve remover um livro com sucesso', async () => {
      const list = await request(testServer).get('/api/books');
      const bookId = list.body.data[0].id;

      const res = await request(testServer).delete(`/api/books/${bookId}`);

      expect(res.status).toBe(200);

      const check = await request(testServer).get(`/api/books/id/${bookId}`);
      expect(check.status).toBe(404);
    });
  });
});
