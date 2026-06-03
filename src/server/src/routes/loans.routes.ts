import { Router } from 'express';

import {
  getAllLoansController,
  getLoanByIdControllerById,
  createLoanController,
  updateLoanController,
  deleteLoanController,
  getLoansByStudentControllerById,
  getLoansByStatusControllerByStatus,
  checkOverdueLoansController,
} from '@/controllers';
import { validateBody } from '@/utils/validation';
import { LoanCreateSchema, LoanUpdateSchema } from '@/services/loan/schema';
import { requireAuth, requireAdmin } from '@/middleware/auth';

const router = Router();

// Admin: marcar empréstimos vencidos
router.post('/loans/check-overdue', requireAuth, requireAdmin, checkOverdueLoansController);

// Admin: visão geral
router.get('/loans', requireAuth, requireAdmin, getAllLoansController);
router.get('/loans/status/:status', requireAuth, requireAdmin, (req, res) =>
  getLoansByStatusControllerByStatus(req.params.status as string, res),
);

// Autenticado: próprio histórico
router.get('/loans/student/:studentId', requireAuth, (req, res) =>
  getLoansByStudentControllerById(req.params.studentId as string, res),
);
router.get('/loans/:id', requireAuth, (req, res) => getLoanByIdControllerById(req.params.id as string, res));

// TODO ⚠️ RESTAURAR QUANDO IMPLEMENTARMOS LOGIN NO MOBILE — adicionar requireAuth de volta
router.post('/loans', requireAuth, validateBody(LoanCreateSchema), createLoanController);

// Autenticado: atualizar (próprio empréstimo ou admin — checagem dentro do controller)
router.put('/loans/:id', requireAuth, validateBody(LoanUpdateSchema), updateLoanController);

// Admin: deletar
router.delete('/loans/:id', requireAuth, requireAdmin, (req, res) => deleteLoanController(req, res));

export default router;
