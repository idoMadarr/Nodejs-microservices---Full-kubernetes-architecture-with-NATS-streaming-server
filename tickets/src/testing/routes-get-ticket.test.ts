import request from 'supertest';
import { app } from '../app';
import { autoSignin } from './setup';
import { Types } from 'mongoose';

it('return 404 in case ticket not found', async () => {
  const id = new Types.ObjectId().toHexString();
  await request(app).post(`/api/tickets/${id}`).send().expect(404);
});

it('return specific ticket', async () => {
  const cookie = autoSignin();
  const createResponse = await request(app)
    .post('/api/tickets/create-ticket')
    .set('Cookie', cookie)
    .send({ title: 'Valid Title', price: 99.9 })
    .expect(200);

  const { id, title, price } = createResponse.body;
  const ticket_response = await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(200);

  expect(ticket_response.body.title).toEqual(title);
  expect(ticket_response.body.price).toEqual(price);
});
