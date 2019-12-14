import config from 'config';
import Redis from 'ioredis';

import { User } from '../entity/User';

const redisConfig = config.get<any>('redis');
const jwtConfig = config.get<any>('jwt');

let redisClient: Redis.Redis;

export const CacheService = {
  initialize() {
    redisClient = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
    });
  },
  async getUserFromCache(id: number): Promise<User | null> {
    const user = await redisClient.get(`user:${id}`);
    return JSON.parse(user || 'null');
  },
  async getUser(id: number) {
    let user = await this.getUserFromCache(id);
    if (!user) {
      const userFromDb = await User.findOne({ id });
      if (!userFromDb) {
        throw new Error('No such user');
      }
      user = userFromDb;
      this.saveUser(user);
    }
    return user;
  },
  saveUser(user: User) {
    return redisClient.setex(`user:${user.id}`, jwtConfig.expiresIn, JSON.stringify(user));
  },
  removeUser(userId: number) {
    return redisClient.del(`user:${userId}`);
  },
};
