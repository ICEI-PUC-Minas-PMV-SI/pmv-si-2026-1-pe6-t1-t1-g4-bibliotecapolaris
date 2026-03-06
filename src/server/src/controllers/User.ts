import type { Request, Response } from "express";

import { getAllUsers, createMockUser} from "@/services";

export async function getAllUsersController(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
}

export async function createMockUserController(_req: Request, res: Response) {
  try {
    const user = await createMockUser();

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar usuário mock" });
  }
}