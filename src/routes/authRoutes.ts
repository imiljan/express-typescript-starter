import { Router } from 'express';

import { login, logout, me, refresh, register } from '../controllers/authController';
import { generalValidator } from '../validators';
import { loginValidator, registerValidator } from '../validators/authValidators';

const authRoutes = Router();

authRoutes.post('/register', registerValidator(), generalValidator, register);

authRoutes.post('/login', loginValidator(), generalValidator, login);

authRoutes.post('/refresh', refresh);

authRoutes.post('/logout', logout);

authRoutes.get('/me', me);

export { authRoutes };
