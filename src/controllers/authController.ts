import { Request, Response } from 'express';

import { AuthService } from '../services/AuthService';
import { CacheService } from '../services/CacheService';

const setCookie = (res: Response, token: string) => {
  res.cookie('jid', token, {
    httpOnly: true,
    path: '/auth/refresh',
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await AuthService.register(email, password);
    return res.status(201).send({
      user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(error.status || 500)
      .send({ message: error.message || 'Internal server error', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await AuthService.login(email, password);
    CacheService.saveUser(user).catch(console.error);
    setCookie(res, refreshToken);

    return res.status(200).send({
      accessToken,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .send({ message: error.message || 'Internal server error', error });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.jid;
    if (!token) {
      return res.status(401).send();
    }

    const { accessToken, refreshToken, user } = await AuthService.refresh(token);

    CacheService.saveUser(user).catch(console.error);

    setCookie(res, refreshToken);

    return res.status(200).send({
      accessToken,
    });
  } catch (error) {
    setCookie(res, '');
    console.error(error);
    return res
      .status(error.status || 500)
      .send({ message: error.message || 'Internal server error', error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const ok = await AuthService.logout(req.user!);
    CacheService.removeUser(req.user!.id).catch(console.error);
    return res.status(200).send({
      ok,
    });
  } catch (error) {
    setCookie(res, '');
    console.error(error);
    return res
      .status(error.status || 500)
      .send({ message: error.message || 'Internal server error', error });
  }
};
