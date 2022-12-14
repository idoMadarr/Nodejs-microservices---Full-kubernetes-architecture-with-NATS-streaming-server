import { Message } from 'node-nats-streaming';
import { Types } from 'mongoose';
import { ExpirationCompleteListener } from '../events/listeners/expiration-complete-listener';
import { natsClient } from '../nats-wrapper/nats-client';
import { ExpirationCompleteEventType, OrderStatus } from '@adar-tickets/common';
import { Ticket } from '../models/Ticket';
import { Order } from '../models/Order';

const initTest = async () => {
  const listener = new ExpirationCompleteListener(natsClient.getClient());

  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    title: 'Valid Title',
    price: 100,
  });
  await ticket.save();

  const order = Order.build({
    userId: new Types.ObjectId().toHexString(),
    status: OrderStatus.CREATED,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEventType['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(), // Mock for ack method
  };

  return { listener, data, message };
};

it('update order status to "Cancelled"', async () => {
  const { listener, data, message } = await initTest();

  await listener.onMessage(data, message);

  const updatedOrder = await Order.findById(data.orderId);
  expect(updatedOrder?.status).toBe(OrderStatus.CANCELLED);
});

it('ack the event', async () => {
  const { listener, data, message } = await initTest();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});
