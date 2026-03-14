import type { Request, Response } from 'express';

import { handleError, sendSuccess } from '@/utils';
import { getAllUsers, createMockUser, createUser, getUserById, updateUser, deleteUser } from '@/services';

export async function getAllUsersController(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    return res.status(200).json({
      error: false,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ error: true, errorCode: 'ERR_SEARCH_USERS', message: 'Erro ao buscar usuários' });
  }
}

export async function createMockUserController(_req: Request, res: Response) {
  try {
    const user = await createMockUser();

    return sendSuccess(res, `Usuário criado com sucesso com ID ${user.id}`, 201);
  } catch (error: any) {
    return handleError(res, error);
  }
}

export async function createUserController(req: Request, res: Response) {
  try {
    // 1. Pegamos os dados que vieram do Frontend
    const { name, email, password, type } = req.body;

    // 2. Mandamos para o Service salvar no banco
    const newUser = await createUser({ name, email, password, type });

    // 3. Respondemos usando a padronização de sucesso do projeto
    return sendSuccess(res, `Usuário ${newUser.name} criado com sucesso!`, 201);
  } catch (error: any) {
    // Se der algum erro (ex: e-mail duplicado), o utilitário cuida disso
    return handleError(res, error);
  }
}

export async function getUserByIdController(req: Request, res: Response) {
  try {
    // Pegamos o ID que vem na URL (chamamos de params)
    const { id } = req.params; 
    
    // Mandamos o serviço buscar no banco
    const user = await getUserById(id as string);

    // Se o serviço voltar vazio, o usuário não existe!
    if (!user) {
      return res.status(404).json({ error: true, message: 'Usuário não encontrado' });
    }

    // Se achou, devolvemos os dados dele
    return res.status(200).json({ error: false, data: user });
  } catch (error: any) {
    return handleError(res, error);
  }
}

export async function updateUserController(req: Request, res: Response) {
  try {
    // Pegamos o ID na URL
    const { id } = req.params;
    
    // Pegamos os novos dados que vieram no Body
    const updateData = req.body; 

    // Mandamos para o serviço atualizar
    const updatedUser = await updateUser(id as string, updateData);

    return res.status(200).json({ error: false, message: 'Usuário atualizado com sucesso!', data: updatedUser });
  } catch (error: any) {
    return handleError(res, error);
  }
}

export async function deleteUserController(req: Request, res: Response) {
  try {
    // Pegamos o ID na URL
    const { id } = req.params;
    
    // Mandamos para o serviço apagar
    await deleteUser(id as string);

    // Retornamos a mensagem de sucesso
    return res.status(200).json({ error: false, message: 'Usuário deletado com sucesso!' });
  } catch (error: any) {
    return handleError(res, error);
  }
}