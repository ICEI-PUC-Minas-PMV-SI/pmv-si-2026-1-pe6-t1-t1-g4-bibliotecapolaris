import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

import { prisma } from '../lib/prisma';

import test from './app';

describe('Author Tests', () => {
  let mockAuthorId: string;

  beforeAll(async () => {
    await prisma.author.deleteMany();

    const author = await prisma.author.create({
      data: {
        name: 'George R. R. Martin',
      },
    });
    mockAuthorId = author.id;
  });

  afterAll(async () => {
    await prisma.author.deleteMany();
    await prisma.$disconnect();
  });

  // --- OPERAÇÃO 1: CRIAÇÃO (POST) ---
  describe('POST /api/author/register', () => {
    it('deve criar um novo autor com sucesso', async () => {
      const res = await request(test).post('/api/author').send({
        name: 'J.R.R. Tolkien',
      });
      expect(res.status).toBe(201);
      expect(res.body.data).toContain('Autor criado com sucesso');
    });

    it('deve retornar erro VALIDATION_ERROR se o nome for inválido (menor que 3 caracteres)', async () => {
      const res = await request(test).post('/api/author').send({
        name: 'A',
      });
      expect(res.status).toBe(401);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });
  });

  // --- OPERAÇÃO 2: LEITURA (GET) ---
  describe('GET /api/author', () => {
    it('deve retornar a lista de todos os autores', async () => {
      const res = await request(test).get('/api/author');

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });
  });

  describe('GET /api/author/:id', () => {
    it('deve retornar um autor específico pelo ID', async () => {
      const res = await request(test).get(`/api/author/${mockAuthorId}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });

    it('deve retornar 404 se tentar buscar um autor que não existe', async () => {
      const ghostId = '0c90a069-3a1f-4888-94af-c798f6f07d0a';
      const res = await request(test).get(`/api/author/${ghostId}`);

      expect(res.status).toBe(404);
      expect(res.body.errorCode).toBe('NOT_FOUND');
    });
  });

  // --- OPERAÇÃO 3: ATUALIZAÇÃO (PUT) ---
  describe('PUT /api/author/:id', () => {
    it('deve atualizar o nome do autor com sucesso', async () => {
      const res = await request(test).put(`/api/author/${mockAuthorId}`).send({
        name: 'George R. R. Martin (Atualizado)',
      });

      expect(res.status).toBe(200);
      expect(res.body.data).toContain('Autor alterado com sucesso');
    });

    it('deve retornar erro 404 ao tentar atualizar um autor inexistente', async () => {
      const ghostId = '0c90a069-3a1f-4888-94af-c798f6f07d0a';
      const res = await request(test).put(`/api/author/${ghostId}`).send({
        name: 'Autor Fantasma',
      });

      expect(res.status).toBe(404);
      expect(res.body.errorCode).toBe('NOT_FOUND');
    });
  });

  // --- OPERAÇÃO 4: DELEÇÃO (DELETE) ---
  describe('DELETE /api/author/:id', () => {
    it('deve remover o autor com sucesso', async () => {
      const res = await request(test).delete(`/api/author/${mockAuthorId}`);

      expect(res.status).toBe(200);
    });

    it('deve retornar 404 se tentar deletar um ID de autor inexistente', async () => {
      const ghostId = '0c90a069-3a1f-4888-94af-c798f6f07d0a';
      const res = await request(test).delete(`/api/author/${ghostId}`);

      expect(res.status).toBe(404);
      expect(res.body.errorCode).toBe('NOT_FOUND');
    });
  });
});
