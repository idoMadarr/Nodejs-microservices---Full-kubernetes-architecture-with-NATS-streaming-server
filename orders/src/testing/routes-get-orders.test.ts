import request from 'supertest';
import { Types } from 'mongoose';
import { app } from '../app';
import { autoSignin } from './setup';
import { Ticket } from '../models/Ticket';

it('fetches orders for a particular user', async () => {
  const cookieForUserA = autoSignin();
  const cookieForUserB = autoSignin();

  const firstTicket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    title: 'First title',
    price: 80,
  });
  const secondTicket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    title: 'Second title',
    price: 90,
  });
  const thirdTicket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    title: 'Third title',
    price: 100,
  });
  await firstTicket.save();
  await secondTicket.save();
  await thirdTicket.save();

  await request(app)
    .post('/api/orders/create-order')
    .set('Cookie', cookieForUserA)
    .send({ ticketId: firstTicket.id })
    .expect(200);
  await request(app)
    .post('/api/orders/create-order')
    .set('Cookie', cookieForUserA)
    .send({ ticketId: secondTicket.id })
    .expect(200);
  await request(app)
    .post('/api/orders/create-order')
    .set('Cookie', cookieForUserB)
    .send({ ticketId: thirdTicket.id })
    .expect(200);

  const response = await request(app)
    .get('/api/orders/')
    .set('Cookie', cookieForUserA)
    .expect(200);

  expect(response.body.length).toBe(2);
});
