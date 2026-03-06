import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  return res.status(200).json({ status: 'OK', message: 'Im fine, thx for asking! Lov u too' });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server started on ${PORT} `);
});
