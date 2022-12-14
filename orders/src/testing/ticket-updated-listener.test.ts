import { Message } from 'node-nats-streaming';
import { Types } from 'mongoose';
import { TicketUpdatedListener } from '../events/listeners/ticket-updated-listener';
import { natsClient } from '../nats-wrapper/nats-client';
import { TicketUpdatedEventType } from '@adar-tickets/common';
import { Ticket } from '../models/Ticket';

const initTest = async () => {
  const listener = new TicketUpdatedListener(natsClient.getClient());

  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    title: 'Valid Title',
    price: 250,
  });
  await ticket.save();

  const data: TicketUpdatedEventType['data'] = {
    id: ticket.id,
    title: 'Updated Title',
    price: 350,
    userId: new Types.ObjectId().toHexString(),
    version: ticket.version + 1,
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(), // Mock for ack method
  };

  return { listener, data, message };
};

it('create, save and update a ticket', async () => {
  const { listener, data, message } = await initTest();

  await listener.onMessage(data, message);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket?.title).toBe('Updated Title');
  expect(ticket?.price).toEqual(350);
});

it('acks the event', async () => {
  const { listener, data, message } = await initTest();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

it('does not call ack if the event skipped version number', async () => {
  const { listener, data, message } = await initTest();
  data.version = 10;

  try {
    await listener.onMessage(data, message);
  } catch (error) {}
  expect(message.ack).not.toHaveBeenCalled();
});
