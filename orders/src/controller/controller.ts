import { RequestHandler } from 'express';
import { Order } from '../models/Order';
import { Ticket } from '../models/Ticket';
import {
  NotFoundError,
  BadRequestError,
  OrderStatus,
} from '@adar-tickets/common';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsClient } from '../nats-wrapper/nats-client';

const EXPIRATION_MIN = 1;
const EXPIRATION_SECONDS = EXPIRATION_MIN * 60;

export const createOrder: RequestHandler = async (req, res, next) => {
  const { ticketId } = req.body;

  const existingTicket = await Ticket.findById(ticketId);

  if (!existingTicket) {
    throw new NotFoundError();
  }

  const isReservedTicket = await existingTicket.isReserved();

  if (isReservedTicket) {
    throw new BadRequestError('Ticket is already reserved');
  }

  // Calculate expiration date (15 min)
  const currentDate = new Date().toLocaleString('he-IL', {
    timeZone: 'Asia/jerusalem',
  });
  const expiration = new Date(currentDate);
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS);

  const expiresAt = expiration.toLocaleString('he-IL', {
    timeZone: 'Asia/jerusalem',
  });

  const newOrder = Order.build({
    userId: req.currentUser?.id!,
    status: OrderStatus.CREATED,
    expiresAt,
    ticket: existingTicket,
  });
  await newOrder.save();

  new OrderCreatedPublisher(natsClient.getClient()).publish({
    id: newOrder.id,
    status: newOrder.status,
    userId: newOrder.userId,
    expiresAt: newOrder.expiresAt.toLocaleString(),
    version: newOrder.version,
    ticket: {
      id: existingTicket.id,
      price: existingTicket.price,
    },
  });
  res.status(200).send(newOrder);
};

export const getOrder: RequestHandler = async (req, res, next) => {
  const id = req.params.orderId;

  const order = await Order.findOne({ id }).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  res.status(200).send(order);
};

export const getOrders: RequestHandler = async (req, res, next) => {
  const userId = req.currentUser?.id;

  const userOrders = await Order.find({ userId }).populate('ticket');

  res.status(200).send(userOrders);
};

export const deleteOrder: RequestHandler = async (req, res, next) => {
  const userId = req.currentUser?.id;
  const orderId = req.params.orderId;

  const order = await Order.findById(orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  order.status = OrderStatus.CANCELLED;
  await order.save();

  new OrderCancelledPublisher(natsClient.getClient()).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toLocaleString(),
    version: order.version,
    ticket: {
      id: order.ticket.id,
      price: order.ticket.price,
    },
  });
  res.status(200).send(order);
};
