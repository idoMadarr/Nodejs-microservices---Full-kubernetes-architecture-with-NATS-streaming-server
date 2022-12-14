import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { sign } from 'jsonwebtoken';

let mongoRepo: any;

// Tell NATS to mimic the event bus implementation by creating a Mock (__mocks__)
// Otherwise, our tests failed beacuse they dont have a nats-client (stan) client.
jest.mock('../nats-wrapper/nats-client');

beforeAll(async () => {
  process.env.JWT_KEY = 'my_test_secret_key';
  mongoRepo = await MongoMemoryServer.create();
  const mongoUri = mongoRepo.getUri();

  await mongoose.connect(mongoUri, {});
});

// Jest hook that run before any single test
beforeEach(async () => {
  // Clearing all mocks before every test
  jest.clearAllMocks();
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
export const autoSignin = (defaultUserId?: string) => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const fackPayload = { id: defaultUserId || id, email: 'test@test.com' };

  const userJwt = sign(fackPayload, process.env.JWT_KEY!);

  const session = { jwt: userJwt };
  const sessionJSON = JSON.stringify(session);
  const base64Session = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64Session}`];
};
