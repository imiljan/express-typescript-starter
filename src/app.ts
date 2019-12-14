import 'reflect-metadata';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import morgan from 'morgan';

// create express app
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan('dev'));

// Middlewares

// ROUTES

app.get('/', (req: Request, res: Response) => {
  res.send({ hello: 'world' });
});

export default app;
