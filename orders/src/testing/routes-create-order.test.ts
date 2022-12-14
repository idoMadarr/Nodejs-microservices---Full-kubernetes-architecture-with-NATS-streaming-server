import request from 'supertest';
import { Types } from 'mongoose';
import { app } from '../app';
import { autoSignin } from './setup';
import { Order } from '../models/Order';
import { Ticket } from '../models/Ticket';
import { OrderStatus } from '@adar-tickets/common';

it('return 404 if the ticket is not existing', async () => {
  const cookie = autoSignin();
  const ticketId = new Types.ObjectId();

  await request(app)
    .post('api/orders/create-order')
    .set('Cookie', cookie)
    .send({ ticketId })
    .expect(404);
});

it('return 400 if the ticket is already reserved', async () => {
  const cookie = autoSignin();

  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    title: 'Valid title',
    price: 119,
  });
  await ticket.save();

  const order = Order.build({
    userId: '123',
    status: OrderStatus.CREATED,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  await request(app)
    .post('/api/orders/create-order')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const cookie = autoSignin();

  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    title: 'Valid title',
    price: 119,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders/create-order')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(200);
});
