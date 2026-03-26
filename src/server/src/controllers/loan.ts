import type { Request, Response } from 'express';

import {
  getAllLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
  getLoansByStudent,
  getLoansByStatus,
} from '@/services';
import { handleError, sendSuccess } from '@/utils';
import { LoanCreateSchema, LoanUpdateSchema } from '@/services/loan/schema';

export async function getAllLoansController(_req: Request, res: Response) {
  try {
    const loans = await getAllLoans();
    return res.status(200).json({ error: false, data: loans });
  } catch (error) {
    handleError(res, error, 'Empréstimo');
  }
}

export async function getLoanByIdController(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    return getLoanByIdControllerById(id, res);
  } catch (error) {
    return handleError(res, error, 'Empréstimo');
  }
}

export async function getLoanByIdControllerById(id: string | undefined, res: Response) {
  try {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: true, errorCode: 'ERR_INVALID_ID', message: 'ID inválido' });
    }

    const loan = await getLoanById(id);
    if (!loan) {
      return res
        .status(404)
        .json({ error: true, errorCode: 'ERR_LOAN_NOT_FOUND', message: 'Empréstimo não encontrado' });
    }

    return res.status(200).json({ error: false, data: loan });
  } catch (error) {
    handleError(res, error, 'Empréstimo');
  }
}

export async function createLoanController(req: Request, res: Response) {
  try {
    const parsed = LoanCreateSchema.parse(req.body);
    const loan = await createLoan(parsed);
    return sendSuccess(res, `Empréstimo criado com sucesso com ID ${loan.id}`, 201);
  } catch (error) {
    handleError(res, error, 'Empréstimo');
  }
}

export async function updateLoanController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: true, errorCode: 'ERR_INVALID_ID', message: 'ID inválido' });
    }

    const parsed = LoanUpdateSchema.parse(req.body);
    const loan = await updateLoan(id, parsed);
    return sendSuccess(res, `Empréstimo atualizado com sucesso`, 200);
  } catch (error) {
    handleError(res, error, 'Empréstimo');
  }
}

export async function deleteLoanController(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: true, errorCode: 'ERR_INVALID_ID', message: 'ID inválido' });
    }

    await deleteLoan(id);
    return sendSuccess(res, `Empréstimo deletado com sucesso`, 200);
  } catch (error) {
    return handleError(res, error, 'Empréstimo');
  }
}

export async function getLoansByStudentController(req: Request, res: Response) {
  try {
    const studentId = Array.isArray(req.params.studentId) ? req.params.studentId[0] : req.params.studentId;
    return getLoansByStudentControllerById(studentId, res);
  } catch (error) {
    handleError(res, error, 'Empréstimo');
  }
}

export async function getLoansByStudentControllerById(studentId: string | undefined, res: Response) {
  try {
    if (!studentId || typeof studentId !== 'string') {
      return res
        .status(400)
        .json({ error: true, errorCode: 'ERR_INVALID_STUDENT_ID', message: 'ID do estudante inválido' });
    }

    const loans = await getLoansByStudent(studentId);
    return res.status(200).json({ error: false, data: loans });
  } catch (error) {
    handleError(res, error, 'Empréstimo');
  }
}

export async function getLoansByStatusController(req: Request, res: Response) {
  try {
    const status = Array.isArray(req.params.status) ? req.params.status[0] : req.params.status;
    return getLoansByStatusControllerByStatus(status, res);
  } catch (error) {
    handleError(res, error, 'Empréstimo');
  }
}

export async function getLoansByStatusControllerByStatus(status: string | undefined, res: Response) {
  try {
    if (!status || typeof status !== 'string') {
      return res.status(400).json({ error: true, errorCode: 'ERR_INVALID_STATUS', message: 'Status inválido' });
    }

    const loans = await getLoansByStatus(status as 'in_progress' | 'returned' | 'canceled' | 'overdue');
    return res.status(200).json({ error: false, data: loans });
  } catch (error) {
    handleError(res, error, 'Empréstimo');
  }
}
