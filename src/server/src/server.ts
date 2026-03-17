import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import router from '@/routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.get('/api/health', (req, res) => {
  return res.status(200).json({ status: 'OK', message: 'Im fine, thx for asking! Lov u too ❤️' });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} 🚨🚨🚨`);
});
