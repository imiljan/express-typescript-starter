import { compare, hash } from 'bcryptjs';
import config from 'config';
import { sign, verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { User } from '../entity/User';
import { AuthError } from '../errors/AuthError';

const jwtConfig = config.get<any>('jwt');

interface ITokensWithUser {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const AuthService = {
  register: async (email: string, password: string): Promise<User> => {
    const hashedPassword = await hash(password, 10);
    let user = User.create({
      email,
      password: hashedPassword,
    });
    user = await user.save();
    delete user.password;
    return user;
  },

  login: async (email: string, password: string): Promise<ITokensWithUser> => {
    const user = await User.findOne(
      { email },
      { select: ['id', 'email', 'tokenVersion', 'password'] },
    );
    if (!user) {
      throw new AuthError(400, 'No such user.');
    }
    if (!(await compare(password, user.password))) {
      throw new AuthError(400, 'Wrong password.');
    }
    delete user.password;
    return {
      accessToken: createAccessToken(user),
      refreshToken: createRefreshToken(user),
      user,
    };
  },

  refresh: async (token: string): Promise<ITokensWithUser> => {
    let payload: any = null;
    try {
      payload = verify(token, jwtConfig.refreshSecret);
    } catch (err) {
      console.error(err);
      throw new AuthError(401, 'Token invalid');
    }

    const user = await User.findOne(
      { id: payload.id },
      { select: ['id', 'email', 'tokenVersion', 'password'] },
    );

    if (!user) {
      throw new AuthError(401, 'No such user');
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new AuthError(401, 'Token version invalid');
    }

    return {
      accessToken: createAccessToken(user),
      refreshToken: createRefreshToken(user),
      user,
    };
  },

  logout: async (user: User): Promise<boolean> => {
    await getRepository(User).increment({ id: user.id }, 'tokenVersion', 1);
    return true;
  },
};

const createAccessToken = (user: User) => {
  return sign({ id: user.id }, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

const createRefreshToken = (user: User) => {
  return sign({ id: user.id, tokenVersion: user.tokenVersion }, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.expiresIn,
  });
};
