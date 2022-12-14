import request from 'supertest';
import { Types } from 'mongoose';
import { app } from '../app';
import { autoSignin } from './setup';
import { Ticket } from '../models/Ticket';

it('cancel user order', async () => {
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
    .put(`/api/orders/delete-order/${response.body.id}`)
    .set('Cookie', cookie)
    .expect(200);
});
