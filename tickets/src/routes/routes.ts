import { Router } from 'express';
import { body } from 'express-validator';
import {
  validationMiddleware,
  authMiddleware,
  currentUserMiddleware,
} from '@adar-tickets/common';
import {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
} from '../controller/controller';

const route = Router();

// https://ticketing.dev/api/tickets/create-ticket
route.post(
  '/create-ticket',
  [
    currentUserMiddleware,
    authMiddleware,
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be valid'),
    validationMiddleware,
  ],
  createTicket
);

// https://ticketing.dev/api/tickets/:ticketId
route.get('/:ticketId', getTicket);

// https://ticketing.dev/api/tickets
route.get('/', getTickets);

// https://ticketing.dev/api/tickets/update/:ticketId
route.put(
  '/update/:ticketId',
  [
    currentUserMiddleware,
    authMiddleware,
    body('title').notEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be valid'),
    validationMiddleware,
  ],
  updateTicket
);

export { route as ticketsRoutes };
