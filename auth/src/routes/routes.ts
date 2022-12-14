import { Router } from 'express';
import { body } from 'express-validator';
import { signUp, signIn, signOut, currentUser } from '../controller/controller';
import {
  validationMiddleware,
  authMiddleware,
  currentUserMiddleware,
} from '@adar-tickets/common';

const route = Router();

// https://ticketing.dev/api/users/signup
route.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 9 })
      .withMessage('Valid password is required'),
    validationMiddleware,
  ],
  signUp
);

// https://ticketing.dev/api/users/signin
route.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Valid Email must be supply'),
    body('password').trim().notEmpty().withMessage('Password must be supply'),
    validationMiddleware,
  ],
  signIn
);

// https://ticketing.dev/api/users/signout
route.post('/signout', signOut);

// https://ticketing.dev/api/users/currentuser
route.get('/currentuser', [currentUserMiddleware], currentUser);

export { route as authRoutes };
