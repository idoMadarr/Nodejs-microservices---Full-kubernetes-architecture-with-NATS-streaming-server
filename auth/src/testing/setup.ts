// Generic implementation for creating a mongodb cache database - For tests only
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../app';
import mongoose from 'mongoose';

let mongoRepo: any;

// Jest hook that run before our tests
beforeAll(async () => {
  process.env.JWT_KEY = 'my_test_secret_key';
  mongoRepo = await MongoMemoryServer.create();
  const mongoUri = mongoRepo.getUri();

  await mongoose.connect(mongoUri, {});
});

// Jest hook that run before any single test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Jest hook that run after tests
afterAll(async () => {
  if (mongoRepo) {
    await mongoRepo.stop();
  }
  await mongoose.connection.close();
});

// Supertest auto auth mechanism
export const autoSignin = async () => {
  const email = 'test@test.com';
  const password = '123456789';

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(200);

  const cookie = response.get('Set-Cookie');
  return cookie;
};
