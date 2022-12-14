import { Message } from 'node-nats-streaming';
import { Types } from 'mongoose';
import { OrderCancelledListener } from '../events/listeners/order-cancelled-listener';
import { natsClient } from '../nats-wrapper/nats-client';
import { OrderCancelledEventType, OrderStatus } from '@adar-tickets/common';
import { Ticket } from '../models/Ticket';

const initTest = async () => {
  const listener = new OrderCancelledListener(natsClient.getClient());

  const ticket = Ticket.build({
    title: 'Valid Title',
    price: 99,
    userId: new Types.ObjectId().toHexString(),
  });
  await ticket.save();
  const orderId = new Types.ObjectId().toHexString();
  ticket.set({ orderId });

  const data: OrderCancelledEventType['data'] = {
    id: orderId,
    status: OrderStatus.CANCELLED,
    userId: ticket.userId,
    expiresAt: new Date().toISOString(),
    version: ticket.version,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(), // Mock for ack method
  };

  return { listener, data, message, ticket, orderId };
};

it('updated ticket, publish event, and ack msg', async () => {
  const { listener, data, message, ticket } = await initTest();
  await listener.onMessage(data, message);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket?.orderId).not.toBeDefined();
  expect(message.ack).toHaveBeenCalled();
  expect(natsClient.client?.publish).toHaveBeenCalled();
});
