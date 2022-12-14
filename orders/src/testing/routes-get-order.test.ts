import request from 'supertest';
import { Types } from 'mongoose';
import { app } from '../app';
import { autoSignin } from './setup';
import { Ticket } from '../models/Ticket';

it('fetche specific order', async () => {
  const cookie = autoSignin();

  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    title: 'Valid title',
    price: 119,
  });
  await ticket.save();

  const response = await request(app)
    .post('/api/orders/create-order')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(200);

  await request(app)
    .get(`/api/orders/${response.body.id}`)
    .set('Cookie', cookie)
    .expect(200);
});

it('return error in case the order is not belong to the user', async () => {
  const cookieA = autoSignin();
  const cookieB = autoSignin();

  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    title: 'Valid title',
    price: 119,
  });
  await ticket.save();

  const response = await request(app)
    .post('/api/orders/create-order')
    .set('Cookie', cookieA)
    .send({ ticketId: ticket.id })
    .expect(200);

  await request(app)
    .get(`/api/orders/${response.body.id}`)
    .set('Cookie', cookieB)
    .expect(401);
});
