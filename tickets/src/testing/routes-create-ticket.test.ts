import request from 'supertest';
import { app } from '../app';
import { autoSignin } from './setup';
import { Ticket } from '../models/Ticket';

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets/create-ticket').send({}).expect(401);
});

it('returns any status code when user is logged in', async () => {
  const cookie = autoSignin();
  const response = await request(app)
    .post('/api/tickets/create-ticket')
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it('return error if an invalide title was provided', async () => {
  const cookie = autoSignin();
  await request(app)
    .post('/api/tickets/create-ticket')
    .set('Cookie', cookie)
    .send({ title: '', price: 99.9 })
    .expect(400);
});

it('return error if an invalide price was provided', async () => {
  const cookie = autoSignin();
  await request(app)
    .post('/api/tickets/create-ticket')
    .set('Cookie', cookie)
    .send({ title: 'Valid Ticket', price: -10 })
    .expect(400);
});

it('creating new ticket', async () => {
  const cookie = autoSignin();
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets/create-ticket')
    .set('Cookie', cookie)
    .send({ title: 'Valid Ticket', price: 100 })
    .expect(200);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});
