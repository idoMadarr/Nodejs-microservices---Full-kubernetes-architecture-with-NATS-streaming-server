import { Router } from 'express';
import { body } from 'express-validator';
import { createCharge } from '../controller/controller';
import {
  validationMiddleware,
  authMiddleware,
  currentUserMiddleware,
} from '@adar-tickets/common';

const route = Router();

// https://ticketing.dev/api/payments/charge
route.post(
  '/charge',
  currentUserMiddleware,
  authMiddleware,
  [body('token').notEmpty(), body('orderId').notEmpty(), validationMiddleware],
  createCharge
);

export { route as paymentsRoutes };
