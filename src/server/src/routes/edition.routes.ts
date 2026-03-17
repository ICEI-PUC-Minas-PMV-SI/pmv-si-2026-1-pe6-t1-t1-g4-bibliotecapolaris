import { Router } from 'express';
import {
  createEditionController,
  deleteEditionController,
  getEditionByIdController,
  updateEditionController,
} from '@/controllers';

const EditionRouter = Router();

EditionRouter.post('/editions/register', createEditionController);
EditionRouter.get('/editions/:id', getEditionByIdController);
EditionRouter.put('/editions/:id', updateEditionController);
EditionRouter.delete('/editions/:id', deleteEditionController);

export default EditionRouter;
