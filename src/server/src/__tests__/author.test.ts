import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

import { prisma } from '../lib/prisma';

import test from './server.test'; // Importação do servidor (app Express)

describe('Author Tests', () => {
  let mockAuthorId: string;

  // Setup: Prepara o banco antes de rodar os testes da suíte
  beforeAll(async () => {
    // Limpa a tabela para evitar conflitos com testes antigos
    await prisma.author.deleteMany();

    // Cria um autor no banco direto pelo Prisma para testarmos as rotas de GET, PUT e DELETE
    const author = await prisma.author.create({
      data: {
        name: 'George R. R. Martin',
      },
    });
    mockAuthorId = author.id;
  });

  // Teardown: Limpa a casa depois que tudo terminar
  afterAll(async () => {
    await prisma.author.deleteMany();
    await prisma.$disconnect();
  });

  // --- OPERAÇÃO 1: CRIAÇÃO (POST) ---
  describe('POST /api/authors', () => {
    it('deve criar um novo autor com sucesso', async () => {
      const res = await request(test).post('/api/authors').send({
        name: 'J.R.R. Tolkien',
      });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('J.R.R. Tolkien');
      expect(res.body.id).toBeDefined(); // Garante que o banco gerou um UUID
    });

    it('deve retornar erro VALIDATION_ERROR se o nome for inválido (menor que 3 caracteres)', async () => {
      const res = await request(test).post('/api/authors').send({
        name: 'A',
      });

      // Confirme se no seu controller o erro de validação retorna 400 ou 401
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });
  });

  // --- OPERAÇÃO 2: LEITURA (GET) ---
  describe('GET /api/authors', () => {
    it('deve retornar a lista de todos os autores', async () => {
      const res = await request(test).get('/api/authors');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/authors/:id', () => {
    it('deve retornar um autor específico pelo ID', async () => {
      const res = await request(test).get(`/api/authors/${mockAuthorId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(mockAuthorId);
      expect(res.body.name).toBe('George R. R. Martin');
    });

    it('deve retornar 404 se tentar buscar um autor que não existe', async () => {
      const ghostId = '0c90a069-3a1f-4888-94af-c798f6f07d0a';
      const res = await request(test).get(`/api/authors/${ghostId}`);

      expect(res.status).toBe(404);
      expect(res.body.errorCode).toBe('NOT_FOUND');
    });
  });

  // --- OPERAÇÃO 3: ATUALIZAÇÃO (PUT) ---
  describe('PUT /api/authors/:id', () => {
    it('deve atualizar o nome do autor com sucesso', async () => {
      const res = await request(test).put(`/api/authors/${mockAuthorId}`).send({
        name: 'George R. R. Martin (Atualizado)',
      });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('George R. R. Martin (Atualizado)');
    });

    it('deve retornar erro 404 ao tentar atualizar um autor inexistente', async () => {
      const ghostId = '0c90a069-3a1f-4888-94af-c798f6f07d0a';
      const res = await request(test).put(`/api/authors/${ghostId}`).send({
        name: 'Autor Fantasma',
      });

      expect(res.status).toBe(404);
      expect(res.body.errorCode).toBe('NOT_FOUND');
    });
  });

  // --- OPERAÇÃO 4: DELEÇÃO (DELETE) ---
  describe('DELETE /api/authors/:id', () => {
    it('deve remover o autor com sucesso', async () => {
      const res = await request(test).delete(`/api/authors/${mockAuthorId}`);

      // Ajuste para 200, 202 ou 204 dependendo do que o seu controller retorna em caso de sucesso no DELETE
      expect(res.status).toBe(200);
    });

    it('deve retornar 404 se tentar deletar um ID de autor inexistente', async () => {
      const ghostId = '0c90a069-3a1f-4888-94af-c798f6f07d0a';
      const res = await request(test).delete(`/api/authors/${ghostId}`);

      expect(res.status).toBe(404);
      expect(res.body.errorCode).toBe('NOT_FOUND');
    });
  });
});
