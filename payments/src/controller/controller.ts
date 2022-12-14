import { RequestHandler } from 'express';
import { Order } from '../models/Order';
import { Payment } from '../models/Payment';
import {
  NotFoundError,
  BadRequestError,
  OrderStatus,
} from '@adar-tickets/common';
import { natsClient } from '../nats-wrapper/nats-client';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { stripeConnection } from '../stripe/stripe';

export const createCharge: RequestHandler = async (req, res, next) => {
  const { token, orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) throw new NotFoundError();

  if (order.status === OrderStatus.CANCELLED)
    throw new BadRequestError('Cannot pay for an cancelled order');

  // Stripe working with Cents for a its currency.
  // For create a charge by USD make sure to multiply the amount by 100
  const charge = await stripeConnection.charges.create({
    amount: order.price * 100,
    currency: 'usd',
    source: token,
    description: 'Create Payment',
  });

  try {
    const payment = Payment.build({
      orderId: order.id,
      stripedId: charge.id,
    });
    await payment.save();

    new PaymentCreatedPublisher(natsClient.getClient()).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripedId,
    });
  } catch (error) {}

  res.status(200).send({ id: order.id });
};
