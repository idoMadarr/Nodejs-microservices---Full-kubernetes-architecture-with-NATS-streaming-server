import { Message } from 'node-nats-streaming';
import { Types } from 'mongoose';
import { OrderCreatedListener } from '../events/listeners/order-created-listener';
import { natsClient } from '../nats-wrapper/nats-client';
import { OrderCreatedEventType, OrderStatus } from '@adar-tickets/common';
import { Ticket } from '../models/Ticket';

const initTest = async () => {
  const listener = new OrderCreatedListener(natsClient.getClient());

  const ticket = Ticket.build({
    title: 'Valid Title',
    price: 99,
    userId: new Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const data: OrderCreatedEventType['data'] = {
    id: new Types.ObjectId().toHexString(),
    status: OrderStatus.CREATED,
    userId: new Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(), // Mock for ack method
  };

  return { listener, data, message, ticket };
};

it('sets the userId of the ticket', async () => {
  const { listener, data, message, ticket } = await initTest();

  await listener.onMessage(data, message);

  const orderedTicket = await Ticket.findById(ticket.id);

  expect(orderedTicket?.orderId).toEqual(data.id);
});

it('acks the event', async () => {
  const { listener, data, message } = await initTest();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, data, message, ticket } = await initTest();

  await listener.onMessage(data, message);

  expect(natsClient.client?.publish).toHaveBeenCalled();
});
