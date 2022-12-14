import request from 'supertest';
import { app } from '../app';

it('clearing cookie after signing out', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@gmail.com', password: '239738416' })
    .expect(200);

  await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@gmail.com', password: '239738416' })
    .expect(200);

  return request(app).post('/api/users/signout').expect(200);
});
