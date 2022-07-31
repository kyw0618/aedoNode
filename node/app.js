import express from 'express'
import morgan from 'morgan';
import fs from 'fs';
import Https from 'https';
import helmet from 'helmet';
import cors from 'cors'
import { connectDB } from './db/db.js';
import appRouter from './router/app.js';
import userRouter from './router/auth.js';
import obituaryRouter from './router/obituary.js';
import condoleRouter from './router/condole.js';
import centerRouter from './router/serviceCenter.js';
import orderRouter from './router/order.js';

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

const options = { // letsencrypt로 받은 인증서 경로를 입력
  ca: fs.readFileSync('/etc/letsencrypt/live/www.aedo.co.kr/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/www.aedo.co.kr/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/www.aedo.co.kr/cert.pem')
  };
app.use('/v1/app', appRouter);
app.use('/v1/user', userRouter);
app.use('/v1/obituary', obituaryRouter);
app.use('/v1/condole', condoleRouter);
app.use('/v1/center', centerRouter);
app.use('/v1/order', orderRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
})

app.use((error, req, res, next) => {
  console.log(error);
  res.sendStatus(500);
})

connectDB().then(() => {
  console.log(`Server is started... ${new Date()}`);
  Https.createServer(options, app).listen(443);
})