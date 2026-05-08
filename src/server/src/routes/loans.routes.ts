import { Router } from 'express';

import {
  getAllLoansController,
  getLoanByIdControllerById,
  createLoanController,
  updateLoanController,
  deleteLoanController,
  getLoansByStudentControllerById,
  getLoansByStatusControllerByStatus,
} from '@/controllers';
import { validateBody } from '@/utils/validation';
import { LoanCreateSchema, LoanUpdateSchema } from '@/services/loan/schema';
import { requireAuth, requireAdmin } from '@/middleware/auth';

const router = Router();

// Admin: visão geral
router.get('/loans', requireAuth, requireAdmin, getAllLoansController);
router.get('/loans/status/:status', requireAuth, requireAdmin, (req, res) =>
  getLoansByStatusControllerByStatus(req.params.status, res),
);

// Autenticado: próprio histórico
router.get('/loans/student/:studentId', requireAuth, (req, res) =>
  getLoansByStudentControllerById(req.params.studentId, res),
);
router.get('/loans/:id', requireAuth, (req, res) => getLoanByIdControllerById(req.params.id, res));

// Autenticado: criar empréstimo
router.post('/loans', requireAuth, validateBody(LoanCreateSchema), createLoanController);

// Autenticado: atualizar (próprio empréstimo ou admin — checagem dentro do controller)
router.put('/loans/:id', requireAuth, validateBody(LoanUpdateSchema), updateLoanController);

// Admin: deletar
router.delete('/loans/:id', requireAuth, requireAdmin, (req, res) => deleteLoanController(req, res));

export default router;
