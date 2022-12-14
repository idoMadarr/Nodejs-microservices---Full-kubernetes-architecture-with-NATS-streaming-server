import { Router } from 'express';
import { body } from 'express-validator';
import {
  validationMiddleware,
  authMiddleware,
  currentUserMiddleware,
} from '@adar-tickets/common';
import {
  createOrder,
  getOrder,
  getOrders,
  deleteOrder,
} from '../controller/controller';

const route = Router();

// https://ticketing.dev/api/orders/create-order
route.post(
  '/create-order',
  [
    currentUserMiddleware,
    authMiddleware,
    body('ticketId').notEmpty().withMessage('Ticket ID is required'),
    validationMiddleware,
  ],
  createOrder
);

// https://ticketing.dev/api/orders/:orderId
route.get('/:orderId', [currentUserMiddleware, authMiddleware], getOrder);

// https://ticketing.dev/api/orders/
route.get('/', [currentUserMiddleware, authMiddleware], getOrders);

// https://ticketing.dev/api/orders/delete-order/:orderId
route.put(
  '/delete-order/:orderId',
  [currentUserMiddleware, authMiddleware],
  deleteOrder
);

export { route as ordersRoutes };
