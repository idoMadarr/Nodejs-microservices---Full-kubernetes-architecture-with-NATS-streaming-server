import { Message } from 'node-nats-streaming';
import { Types } from 'mongoose';
import { TicketCreatedListener } from '../events/listeners/ticket-created-listener';
import { natsClient } from '../nats-wrapper/nats-client';
import { TicketCreatedEventType } from '@adar-tickets/common';
import { Ticket } from '../models/Ticket';

const initTest = async () => {
  const listener = new TicketCreatedListener(natsClient.getClient());
  const data: TicketCreatedEventType['data'] = {
    id: new Types.ObjectId().toHexString(),
    title: 'Valid Title',
    price: 25,
    userId: new Types.ObjectId().toHexString(),
    version: 0,
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(), // Mock for ack method
  };

  return { listener, data, message };
};

it('create and save a ticket', async () => {
  const { listener, data, message } = await initTest();

  await listener.onMessage(data, message);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
});

it('ack the event', async () => {
  const { listener, data, message } = await initTest();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});
