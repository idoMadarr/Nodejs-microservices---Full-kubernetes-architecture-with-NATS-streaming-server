import { Message } from 'node-nats-streaming';
import { Types } from 'mongoose';
import { OrderCreatedListener } from '../events/listeners/order-created-listener';
import { natsClient } from '../nats-wrapper/nats-client';
import { OrderCreatedEventType, OrderStatus } from '@adar-tickets/common';
import { Order } from '../models/Order';

const initTest = async () => {
  const listener = new OrderCreatedListener(natsClient.getClient());
  const orderId = new Types.ObjectId().toHexString();
  const data: OrderCreatedEventType['data'] = {
    id: orderId,
    status: OrderStatus.CREATED,
    userId: new Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    version: 0,
    ticket: {
      id: new Types.ObjectId().toHexString(),
      price: 150,
    },
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(), // Mock for ack method
  };

  return { listener, data, message, orderId };
};

it('save new order in mongo', async () => {
  const { listener, data, message, orderId } = await initTest();

  await listener.onMessage(data, message);

  const order = await Order.findById(data.id);

  expect(order?.id).toEqual(orderId);
  expect(order?.price).toEqual(150);
});

it('acks the event', async () => {
  const { listener, data, message } = await initTest();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});
