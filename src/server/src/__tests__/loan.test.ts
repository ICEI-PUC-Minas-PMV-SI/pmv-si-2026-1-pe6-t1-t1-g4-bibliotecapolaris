import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

import { prisma } from '../lib/prisma';

import test from './app';
import { createAuthor, createUser, createBook, MOCK_USER_ID, MOCK_BOOK_ID } from './wishlist.factory';
import { MOCK_LOAN_ID } from './review.factory';

describe('Loan Tests', () => {
  let createdLoanId: string;

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
  describe('POST /api/loans', () => {
    it('deve criar um empréstimo com sucesso', async () => {
      const res = await request(test).post('/api/loans').send({
        studentId: MOCK_USER_ID,
        bookId: MOCK_BOOK_ID,
        loanDate: '2026-04-10',
        dueDate: '2026-04-17',
        status: 'in_progress',
      });

      expect(res.status).toBe(201);
      expect(res.body.data).toContain('Empréstimo criado com sucesso ');

      const match = res.body.data.match(/ID\s+(\S+)/);
      if (match) createdLoanId = match[1];
    });

    it('deve retornar erro de validação se o studentId for inválido', async () => {
      const res = await request(test).post('/api/loans').send({
        studentId: 'id-invalido',
        bookId: MOCK_BOOK_ID,
        loanDate: '2026-04-10',
        dueDate: '2026-04-17',
        status: 'in_progress',
      });

      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe('ERR_VALIDATION');
    });

    it('deve retornar erro de validação se o bookId for inválido', async () => {
      const res = await request(test).post('/api/loans').send({
        studentId: MOCK_USER_ID,
        bookId: 'id-invalido',
        loanDate: '2026-04-10',
        dueDate: '2026-04-17',
        status: 'in_progress',
      });

      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe('ERR_VALIDATION');
    });

    it('deve retornar erro de validação se o status for inválido', async () => {
      const res = await request(test).post('/api/loans').send({
        studentId: MOCK_USER_ID,
        bookId: MOCK_BOOK_ID,
        loanDate: '2026-04-10',
        dueDate: '2026-04-17',
        status: 'invalid_status',
      });

      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe('ERR_VALIDATION');
    });

    it('deve retornar erro de validação se campos obrigatórios estiverem faltando', async () => {
      const res = await request(test).post('/api/loans').send({
        studentId: MOCK_USER_ID,
      });

      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe('ERR_VALIDATION');
    });
  });

  // --- OPERAÇÃO 2: LEITURA (GET ALL) ---
  describe('GET /api/loans', () => {
    it('deve retornar a lista de todos os empréstimos', async () => {
      const res = await request(test).get('/api/loans');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // --- OPERAÇÃO 3: LEITURA POR ID (GET) ---
  describe('GET /api/loans/:id', () => {
    it('deve retornar um empréstimo pelo ID', async () => {
      const res = await request(test).get(`/api/loans/${createdLoanId}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.id).toBe(createdLoanId);
    });

    it('deve retornar 404 para ID inexistente', async () => {
      const ghostId = '0c90a069-3a1f-4888-94af-c798f6f07d0a';
      const res = await request(test).get(`/api/loans/${ghostId}`);

      expect(res.status).toBe(404);
    });
  });

  // --- OPERAÇÃO 4: LEITURA POR ESTUDANTE (GET) ---
  describe('GET /api/loans/student/:studentId', () => {
    it('deve retornar empréstimos de um estudante específico', async () => {
      const res = await request(test).get(`/api/loans/student/${MOCK_USER_ID}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('deve retornar lista vazia para estudante sem empréstimos', async () => {
      const ghostId = '0c90a069-3a1f-4888-94af-c798f6f07d0a';
      const res = await request(test).get(`/api/loans/student/${ghostId}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  // --- OPERAÇÃO 5: LEITURA POR STATUS (GET) ---
  describe('GET /api/loans/status/:status', () => {
    it('deve retornar empréstimos com status in_progress', async () => {
      const res = await request(test).get('/api/loans/status/in_progress');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('deve retornar lista vazia para status sem empréstimos', async () => {
      const res = await request(test).get('/api/loans/status/canceled');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  // --- OPERAÇÃO 6: ATUALIZAÇÃO (PUT) ---
  describe('PUT /api/loans/:id', () => {
    it('deve atualizar um empréstimo com sucesso', async () => {
      const res = await request(test).put(`/api/loans/${createdLoanId}`).send({
        status: 'returned',
        returnDate: '2026-04-15',
      });

      expect(res.status).toBe(202);
      expect(res.body.data).toContain('Empréstimo atualizado com sucesso');
    });

    it('deve retornar 404 ao tentar atualizar um empréstimo inexistente', async () => {
      const ghostId = '0c90a069-3a1f-4888-94af-c798f6f07d0a';
      const res = await request(test).put(`/api/loans/${ghostId}`).send({
        status: 'returned',
      });

      expect(res.status).toBe(404);
    });
  });

  // --- OPERAÇÃO 7: DELEÇÃO (DELETE) ---
  describe('DELETE /api/loans/:id', () => {
    it('deve deletar um empréstimo com sucesso', async () => {
      // Create a loan to delete
      const createRes = await request(test).post('/api/loans').send({
        studentId: MOCK_USER_ID,
        bookId: MOCK_BOOK_ID,
        loanDate: '2026-04-11',
        dueDate: '2026-04-18',
        status: 'in_progress',
      });

      const match = createRes.body.data.match(/ID\s+(\S+)/);
      const loanToDelete = match ? match[1] : '';

      const res = await request(test).delete(`/api/loans/${loanToDelete}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toContain('deletado com sucesso');
    });

    it('deve retornar 404 ao tentar deletar um empréstimo inexistente', async () => {
      const ghostId = '0c90a069-3a1f-4888-94af-c798f6f07d0a';
      const res = await request(test).delete(`/api/loans/${ghostId}`);

      expect(res.status).toBe(404);
    });
  });
});
