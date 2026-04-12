import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

import { prisma } from '../lib/prisma';

import test from './app';

const mockUser = {
  name: 'Filipe Tester',
  email: 'filipe.tester@unipolaris.br',
  password: 'Password123!',
  type: 'student',
};

let createdUserId: string;

describe('User CRUD Tests', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: { email: mockUser.email },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: mockUser.email },
    });
    await prisma.$disconnect();
  });

  // --- OPERAÇÃO 1: CRIAÇÃO (POST) ---
  describe('POST /api/users/register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const res = await request(test).post('/api/users/register').send(mockUser);

      expect(res.status).toBe(201);
      expect(res.body.error).toBe(false);
      expect(res.body.data).toContain('Usuário criado com sucesso');

      const userInDb = await prisma.user.findUnique({
        where: { email: mockUser.email },
      });
      createdUserId = userInDb!.id;
    });

    it('deve retornar erro 401 se faltarem dados obrigatórios', async () => {
      const res = await request(test).post('/api/users/register').send({
        name: 'Incompleto',
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe(true);
    });
  });

  // --- OPERAÇÃO 2: LEITURA (GET) ---
  describe('GET /api/users/:id', () => {
    it('deve retornar os dados do usuário recém-criado', async () => {
      const res = await request(test).get(`/api/users/${createdUserId}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(mockUser.email);
    });

    it('deve retornar 404 se o usuário não existir', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const res = await request(test).get(`/api/users/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe(true);
    });
  });

  // --- OPERAÇÃO 3: ATUALIZAÇÃO (PUT) ---
  describe('PUT /api/users/:id', () => {
    it('deve atualizar o nome do usuário com sucesso', async () => {
      const res = await request(test).put(`/api/users/${createdUserId}`).send({
        name: 'Filipe Atualizado',
        email: mockUser.email,
        password: mockUser.password,
        type: mockUser.type,
        lastPassword: mockUser.password,
      });

      expect(res.status).toBe(202);
      expect(res.body.error).toBe(false);
      expect(res.body.data).toContain('Usuário atualizado com sucesso');
    });
  });

  // --- OPERAÇÃO 4: DELEÇÃO (DELETE) ---
  describe('DELETE /api/users/:id', () => {
    it('deve deletar o usuário do sistema com sucesso', async () => {
      const res = await request(test).delete(`/api/users/${createdUserId}`);

      expect(res.status).toBe(202);
      expect(res.body.error).toBe(false);
      expect(res.body.data).toContain('Usuário deletado com sucesso');
    });
  });
});
