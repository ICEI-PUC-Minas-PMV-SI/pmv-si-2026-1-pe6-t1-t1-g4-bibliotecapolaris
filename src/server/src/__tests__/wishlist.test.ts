import { describe, expect, it, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';

import { prisma } from '../lib/prisma';

import test from './app';
import { createAuthor, createUser, createBook, MOCK_USER_ID, MOCK_BOOK_ID } from './wishlist.factory';

describe('Wishlist Tests', () => {
  beforeEach(async () => {
    await prisma.wishlist.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.user.deleteMany();

    const author = await createAuthor();
    await createUser();
    await createBook(author.id);
  });

  afterAll(async () => {
    await prisma.wishlist.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.user.deleteMany();

    await prisma.$disconnect();
  });

  // --- OPERAÇÃO 1: CRIAÇÃO (POST) ---
  describe('POST /api/wishlist/register', () => {
    it('deve adicionar um livro à lista de desejos com sucesso', async () => {
      const res = await request(test).post('/api/wishlist/register').send({
        studentId: MOCK_USER_ID,
        bookId: MOCK_BOOK_ID,
      });

      expect(res.status).toBe(201);
      expect(res.body.data).toContain('Livro adicionado');
    });

    it('deve retornar 401 VALIDATION_ERROR se o UUID for inválido', async () => {
      const res = await request(test).post('/api/wishlist/register').send({
        studentId: MOCK_USER_ID,
        bookId: 'id-invalido',
      });

      expect(res.status).toBe(401);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('deve retornar 400 ERR_FOREIGN_KEY se o livro não existir no banco', async () => {
      const ghostId = '0c90a069-3a1f-4888-94af-c798f6f07d0a';
      const res = await request(test).post('/api/wishlist/register').send({
        studentId: MOCK_USER_ID,
        bookId: ghostId,
      });

      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe('ERR_FOREIGN_KEY');
    });
  });

  // // --- OPERAÇÃO 2: LEITURA (GET) ---
  describe('GET /api/wishlist/:id', () => {
    it('deve retornar a lista de desejos quando houver livros', async () => {
      await prisma.wishlist.create({
        data: { studentId: MOCK_USER_ID, bookId: MOCK_BOOK_ID },
      });

      const res = await request(test).get(`/api/wishlist/${MOCK_USER_ID}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });

    it('deve retornar 404 se a lista estiver vazia', async () => {
      await prisma.wishlist.deleteMany();

      const res = await request(test).get(`/api/wishlist/${MOCK_USER_ID}`);

      expect(res.status).toBe(404);
      expect(res.body.errorCode).toBe('NOT_FOUND');
      expect(res.body.message).toBe('Nenhum livro encontrado na lista de desejos');
    });
  });

  // --- OPERAÇÃO 3: DELEÇÃO (DELETE) ---
  describe('DELETE /api/wishlist/:studentId/:bookId', () => {
    it('deve remover o livro da lista com sucesso', async () => {
      await prisma.wishlist.create({
        data: { studentId: MOCK_USER_ID, bookId: MOCK_BOOK_ID },
      });

      const res = await request(test).delete(`/api/wishlist/${MOCK_USER_ID}/${MOCK_BOOK_ID}`);

      expect(res.status).toBe(202);
      expect(res.body.data).toContain('Livro removido');
    });

    it('deve retornar erro se o ID for inválido ou ausente', async () => {
      const res = await request(test).delete(`/api/wishlist/${MOCK_USER_ID}/undefined`);

      expect(res.status).toBe(404);
      expect(res.body.errorCode).toBe('NOT_FOUND');
    });
  });
});
