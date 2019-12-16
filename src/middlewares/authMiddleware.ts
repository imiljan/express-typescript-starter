import config from 'config';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { CacheService } from '../services/CacheService';

const jwtConfig = config.get<any>('jwt');

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allowedRoutes = ['/auth/login', '/auth/register', '/auth/refresh'];
    if (allowedRoutes.indexOf(req.url) > -1) {
      return next();
    }
    // allow getting media for everyone
    if (req.url.includes('/media') && !req.url.includes('upload')) {
      return next();
    }
    if (!req.headers.authorization) {
      return res.status(401).send({ message: 'Missing authorization header' });
    }
    if (req.headers.authorization.split(' ').length < 2) {
      return res.status(401).send({ message: 'Token invalid' });
    }
    const token = req.headers.authorization.split(' ')[1];
    verify(token, jwtConfig.accessSecret, async (err: any, decoded: any) => {
      if (err) {
        return res.status(401).send({ message: 'Token invalid' });
      }
      if (typeof decoded !== 'object') {
        return res.status(401).send({ message: 'Token payload invalid' });
      }
      if (!('id' in decoded)) {
        return res.status(401).send({ message: 'Token payload invalid' });
      }
      const id = (decoded as any).id;
      const user = await CacheService.getUser(id);
      req.user = user;
      return next();
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Auth middleware error' });
  }
};
