import request from 'supertest';
import { app } from '../app';

it('email does not exist', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({ email: 'test@gmail.com', password: '239738416' })
    .expect(400);
});

it('incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@gmail.com', password: '239738416' })
    .expect(200);

  return request(app)
    .post('/api/users/signin')
    .send({ email: 'test@gmail.com', password: '123456789' })
    .expect(400);
});

it('return 200 with valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@gmail.com', password: '239738416' })
    .expect(200);

  return request(app)
    .post('/api/users/signin')
    .send({ email: 'test@gmail.com', password: '239738416' })
    .expect(200);
});
