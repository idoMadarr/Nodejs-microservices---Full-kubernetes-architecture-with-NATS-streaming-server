import { RequestHandler } from 'express';
import { Ticket } from '../models/Ticket';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '@adar-tickets/common';
import { natsClient } from '../nats-wrapper/nats-client';
import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher';
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';

export const createTicket: RequestHandler = async (req, res, next) => {
  const { title, price } = req.body;
  const createTicket = Ticket.build({
    title,
    price,
    userId: req.currentUser?.id!,
  });
  await createTicket.save();

  new TicketCreatedPublisher(natsClient.getClient()).publish({
    id: createTicket.id,
    title: createTicket.title,
    price: createTicket.price,
    userId: createTicket.userId,
    version: createTicket.version,
  });

  res.status(200).send(createTicket);
};

export const getTicket: RequestHandler = async (req, res, next) => {
  const { ticketId } = req.params;

  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).send(ticket);
};

export const getTickets: RequestHandler = async (req, res, next) => {
  const tickets = await Ticket.find({ orderId: undefined });

  res.status(200).send(tickets);
};

export const updateTicket: RequestHandler = async (req, res, next) => {
  const { title, price } = req.body;
  const { ticketId } = req.params;

  const existTicket = await Ticket.findById(ticketId);

  if (!existTicket) {
    throw new NotFoundError();
  }

  if (existTicket.userId !== req.currentUser?.id!) {
    throw new UnauthorizedError();
  }

  if (existTicket.orderId) {
    throw new BadRequestError('Cannot update a reserved ticket');
  }

  existTicket.set({ title, price });
  await existTicket.save();

  new TicketUpdatedPublisher(natsClient.getClient()).publish({
    id: existTicket.id,
    title: existTicket.title,
    price: existTicket.price,
    userId: existTicket.userId,
    version: existTicket.version,
  });

  res.status(200).send(existTicket);
};
