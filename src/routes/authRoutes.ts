import { Router } from 'express';

import { login, logout, refresh, register } from '../controllers/authController';
import { generalValidator } from '../validators';
import { loginValidator, registerValidator } from '../validators/authValidators';

const authRoutes = Router();

authRoutes.post('/register', registerValidator(), generalValidator, register);

authRoutes.post('/login', loginValidator(), generalValidator, login);

authRoutes.post('/refresh', refresh);

authRoutes.post('/logout', logout);

export { authRoutes };
