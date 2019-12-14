import { body } from 'express-validator';

import { User } from '../entity/User';

export function registerValidator() {
  return [
    body('email')
      .isLength({ min: 3 })
      .isEmail()
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error('There is already a user with that email.');
        }
      }),
    body('password', 'Password has to be at least 6 characters long.').isLength({ min: 6 }),
  ];
}

export function loginValidator() {
  return [
    body('email', 'Email is required.')
      .exists()
      .isEmail(),
    body('password', 'Password is required.')
      .not()
      .isEmpty(),
  ];
}
