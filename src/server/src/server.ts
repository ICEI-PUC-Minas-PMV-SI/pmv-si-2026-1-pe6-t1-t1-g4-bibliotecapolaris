import 'dotenv/config';

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  require('module-alias/register');
}
import express from 'express';
import cors from 'cors';

import { generateOpenApiDocuments } from './lib/zod-to-openapi';
import { swaggerRoute } from './lib/swagger';

import router from '@/routes';

const app = express();

const open_api_documents = generateOpenApiDocuments();

const defaultOrigins = ['http://localhost:3000', 'http://localhost:8081', 'http://192.168.1.106:8081'];
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  : defaultOrigins;

app.use(
  cors({
    origin: allowedOrigins,
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);
app.use(express.json());

app.use('/api', router);

app.get('/api/health', (req, res) => {
  return res.status(200).json({ status: 'OK', message: 'Im fine, thx for asking! Lov u too ❤️' });
});

app.get('/api/docs.raw', (req, res) => res.json(open_api_documents));
app.use('/api/docs', swaggerRoute());

app.use((req: import('express').Request, res: import('express').Response) => {
  res.status(404).json({ status: 'ERROR', message: `Rota ${req.method} ${req.path} não encontrada` });
});

const PORT = Number(process.env.PORT) || 3333;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT} 🚨🚨🚨`);
});
