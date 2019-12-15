import 'reflect-metadata';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import morgan from 'morgan';

import { authMiddleware } from './middlewares/authMiddleware';
import { authRoutes } from './routes/authRoutes';
import { mediaRoutes } from './routes/mediaRoutes';

// create express app
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan('dev'));

// Middleware
app.use(authMiddleware);

// ROUTES
app.use('/auth', authRoutes);

app.use('/media', mediaRoutes);

app.get('/', (_: Request, res: Response) => {
  res.send({ hello: 'world' });
});

export default app;
