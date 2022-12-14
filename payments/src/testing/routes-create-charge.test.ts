import request from 'supertest';
import { app } from '../app';
import { Types } from 'mongoose';
import { autoSignin } from './setup';
import { Order } from '../models/Order';
import { OrderStatus } from '@adar-tickets/common';
import { Payment } from '../models/Payment';

jest.mock('../stripe/stripe');

it('return 404 when order doest not exist', async () => {
  const cookie = autoSignin();
  const response = await request(app)
    .post('/api/payments/charge')
    .set('Cookie', cookie)
    .send({
      orderId: new Types.ObjectId().toHexString(),
      token: 'Stripe_Token',
    });

  expect(response.status).toBe(404);
});

it('return 401 when order does not belong to the specific user', async () => {
  const cookie = autoSignin();
  const userId = new Types.ObjectId().toHexString();

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    price: 125,
    status: OrderStatus.CREATED,
    userId,
    version: 0,
  });
  await order.save();

  const response = await request(app)
    .post('/api/payments/charge')
    .set('Cookie', cookie)
    .send({
      orderId: order.id,
      token: 'Stripe_Token',
    });

  expect(response.status).toBe(401);
});

it('return 400 when order is cancelled', async () => {
  const userId = new Types.ObjectId().toHexString();
  const cookie = autoSignin(userId);

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    price: 125,
    status: OrderStatus.CANCELLED,
    userId,
    version: 0,
  });
  await order.save();

  const response = await request(app)
    .post('/api/payments/charge')
    .set('Cookie', cookie)
    .send({
      orderId: order.id,
      token: 'Stripe_Token',
    });

  expect(response.status).toBe(400);
});

it('return 200 with valid input', async () => {
  const userId = new Types.ObjectId().toHexString();
  const cookie = autoSignin(userId);

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    price: 125,
    status: OrderStatus.CREATED,
    userId,
    version: 0,
  });
  await order.save();

  await request(app)
    .post('/api/payments/charge')
    .set('Cookie', cookie)
    .send({
      orderId: order.id,
      token: 'tok_visa',
    })
    .expect(200);
});
