import request from 'supertest';
import { app } from '../app';
import { autoSignin } from './setup';

// NOTICE: Our browser & postman knows how to manage cookie (auto)
// on a contrary, supertest doesn't!
it('returns response with user details', async () => {
  const cookie = await autoSignin();
  const currentuserResponse = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  expect(currentuserResponse.body.currentUser.email).toEqual('test@test.com');
});

it('returns null when user is not authenticated', async () => {
  return request(app).get('/api/users/currentuser').send({}).expect(401);
});
