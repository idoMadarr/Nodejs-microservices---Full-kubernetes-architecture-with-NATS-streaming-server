import request from 'supertest';
import { app } from '../app';

it('return a 200 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@gmail.com', password: '239738416' })
    .expect(200);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'testgmail.com', password: '239738416' })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@gmail.com', password: '239' })
    .expect(400);
});

it('returns a 400 with missing credentials', async () => {
  return request(app).post('/api/users/signup').send({}).expect(400);
});

it('return 400 if existing user found', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'ido12@gmail.com', password: '239738416' })
    .expect(200);

  await request(app)
    .post('/api/users/signup')
    .send({ email: 'ido12@gmail.com', password: '239738416' })
    .expect(400);
});

it('sets a cookie after successful signing up', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'ido@gmail.com', password: '239738416' })
    .expect(200);

  // Checking the cookie implementation
  expect(response.get('Set-Cookie')).toBeDefined();
});
