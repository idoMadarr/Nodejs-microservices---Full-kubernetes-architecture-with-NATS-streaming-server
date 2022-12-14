import { Message } from 'node-nats-streaming';
import { Types } from 'mongoose';
import { OrderCancelledListener } from '../events/listeners/order-cancelled-listener';
import { natsClient } from '../nats-wrapper/nats-client';
import { OrderCancelledEventType, OrderStatus } from '@adar-tickets/common';
import { Order } from '../models/Order';

const initTest = async () => {
  const listener = new OrderCancelledListener(natsClient.getClient());

  const orderId = new Types.ObjectId().toHexString();

  const order = Order.build({
    id: orderId,
    price: 150,
    status: OrderStatus.CREATED,
    userId: new Types.ObjectId().toHexString(),
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEventType['data'] = {
    id: orderId,
    status: order.status,
    userId: order.userId,
    expiresAt: new Date().toISOString(),
    version: order.version,
    ticket: {
      id: new Types.ObjectId().toHexString(),
      price: order.price,
    },
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(), // Mock for ack method
  };

  return { listener, data, message, orderId };
};

it('change order status when user canclled order', async () => {
  const { listener, data, message, orderId } = await initTest();

  await listener.onMessage(data, message);

  const order = await Order.findById(data.id);

  expect(order?.id).toEqual(orderId);
  expect(order?.status).toEqual(OrderStatus.CANCELLED);
});

it('acks the event', async () => {
  const { listener, data, message } = await initTest();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});
