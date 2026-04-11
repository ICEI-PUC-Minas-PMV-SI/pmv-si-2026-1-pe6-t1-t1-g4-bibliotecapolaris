import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

import { prisma } from '../lib/prisma';

import test from './server.test';
import { createAuthor, createUser, createBook } from './wishlist.factory';
import { createLoan, createReview, MOCK_USER_ID, MOCK_BOOK_ID, MOCK_LOAN_ID, MOCK_REVIEW_ID } from './review.factory';

describe('Review Tests', () => {
  beforeAll(async () => {
    await prisma.review.deleteMany();
    await prisma.loan.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.user.deleteMany();

    const author = await createAuthor();
    await createUser();
    await createBook(author.id);
    await createLoan();
    await createReview();
  });

  afterAll(async () => {
    await prisma.review.deleteMany();
    await prisma.loan.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.user.deleteMany();

    await prisma.$disconnect();
  });

  // --- OPERAÇÃO 1: CRIAÇÃO (POST) ---
  describe('POST /api/review', () => {
    it('deve criar uma review com sucesso', async () => {
      await prisma.review.deleteMany();

      const res = await request(test).post('/api/review').send({
        rating: 5,
        loanId: MOCK_LOAN_ID,
        date: '2026-04-10',
      });

      expect(res.status).toBe(201);
      expect(res.body.data).toBeDefined();
    });

    it('deve retornar 401 VALIDATION_ERROR se o rating for inválido', async () => {
      const res = await request(test).post('/api/review').send({
        rating: 6,
        loanId: MOCK_LOAN_ID,
        date: '2026-04-10',
      });

      expect(res.status).toBe(401);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('deve retornar 401 VALIDATION_ERROR se o rating for menor que 1', async () => {
      const res = await request(test).post('/api/review').send({
        rating: 0,
        loanId: MOCK_LOAN_ID,
        date: '2026-04-10',
      });

      expect(res.status).toBe(401);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('deve retornar 401 VALIDATION_ERROR se o loanId for inválido', async () => {
      const res = await request(test).post('/api/review').send({
        rating: 5,
        loanId: 'id-invalido',
        date: '2026-04-10',
      });

      expect(res.status).toBe(401);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });
  });

  // --- OPERAÇÃO 2: LEITURA (GET ALL) ---
  describe('GET /api/review', () => {
    it('deve retornar todas as reviews', async () => {
      const res = await request(test).get('/api/review');

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });
  });

  // --- OPERAÇÃO 3: LEITURA (GET BY ID) ---
  describe('GET /api/review/:id', () => {
    it('deve retornar uma review pelo ID', async () => {
      const res = await request(test).get(`/api/review/${MOCK_REVIEW_ID}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });
  });

  // --- OPERAÇÃO 4: LEITURA (GET BY USER) ---
  describe('GET /api/review/user/:userId', () => {
    it('deve retornar reviews de um usuário', async () => {
      const res = await request(test).get(`/api/review/user/${MOCK_USER_ID}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });
  });

  // --- OPERAÇÃO 5: LEITURA (GET BY BOOK) ---
  describe('GET /api/review/book/:bookId', () => {
    it('deve retornar reviews de um livro', async () => {
      const res = await request(test).get(`/api/review/book/${MOCK_BOOK_ID}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });
  });

  // --- OPERAÇÃO 6: ATUALIZAÇÃO (PUT) ---
  describe('PUT /api/review/:id', () => {
    it('deve atualizar uma review com sucesso', async () => {
      await prisma.review.deleteMany();
      await createReview();

      const res = await request(test).put(`/api/review/${MOCK_REVIEW_ID}`).send({
        rating: 4,
        description: 'Bom livro, mas poderia ser melhor',
      });

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });
  });

  // --- OPERAÇÃO 7: DELEÇÃO (DELETE) ---
  describe('DELETE /api/review/:id', () => {
    it('deve remover uma review com sucesso', async () => {
      await prisma.review.deleteMany();
      await createReview();

      const res = await request(test).delete(`/api/review/${MOCK_REVIEW_ID}`);

      expect(res.status).toBe(202);
      expect(res.body.data).toContain('removida com sucesso');
    });

    it('deve retornar 404 se o ID não existir', async () => {
      const res = await request(test).delete('/api/review/id-invalido');

      expect(res.status).toBe(404);
    });
  });
});
