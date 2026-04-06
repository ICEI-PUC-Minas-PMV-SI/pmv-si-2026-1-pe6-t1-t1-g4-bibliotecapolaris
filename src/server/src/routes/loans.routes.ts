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

const router = Router();

router.get('/loans', getAllLoansController);
router.get('/loans/:id', (req, res) => getLoanByIdControllerById(req.params.id, res));
router.post('/loans', validateBody(LoanCreateSchema), createLoanController);
router.put('/loans/:id', validateBody(LoanUpdateSchema), updateLoanController);
router.delete('/loans/:id', (req, res) => deleteLoanController(req, res));
router.get('/loans/student/:studentId', (req, res) => getLoansByStudentControllerById(req.params.studentId, res));
router.get('/loans/status/:status', (req, res) => getLoansByStatusControllerByStatus(req.params.status, res));

export default router;
