import express from 'express';
import cors from 'cors';

import 'dotenv/config';

import router from '@/routes';

const test = express();

test.use(cors());
test.use(express.json());

test.use('/api', router);

export default test;
