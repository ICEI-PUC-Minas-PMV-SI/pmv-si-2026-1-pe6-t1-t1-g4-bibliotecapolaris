import express from 'express';
import cors from 'cors';

import 'dotenv/config';
<<<<<<< HEAD:apps/backend/server/src/server.ts

import { generateOpenApiDocuments } from './lib/zod-to-openapi';
import { swaggerRoute } from './lib/swagger';

=======
>>>>>>> server:src/server/src/server.ts
import router from '@/routes';

const app = express();

const open_api_documents = generateOpenApiDocuments();

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.get('/api/health', (req, res) => {
  return res.status(200).json({ status: 'OK', message: 'Im fine, thx for asking! Lov u too ❤️' });
});

app.get('/api/docs.raw', (req, res) => res.json(open_api_documents));
app.use('/api/docs', swaggerRoute());

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} 🚨🚨🚨`);
});
