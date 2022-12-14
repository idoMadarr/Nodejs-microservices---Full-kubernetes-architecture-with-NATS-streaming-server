import request from 'supertest';
import { app } from '../app';
import { autoSignin } from './setup';

it('fetch list of tickets', async () => {
  const cookie = autoSignin();
  await request(app)
    .post('/api/tickets/create-ticket')
    .set('Cookie', cookie)
    .send({ title: 'Valie title', price: 99.9 })
    .expect(200);

  await request(app)
    .post('/api/tickets/create-ticket')
    .set('Cookie', cookie)
    .send({ title: 'Valie title_2', price: 98.9 })
    .expect(200);

  const response = await request(app).get('/api/tickets').expect(200);

  expect(response.body.length).toEqual(2);
});
