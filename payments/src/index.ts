import { app } from './app';
import mongoose from 'mongoose';
import { natsClient } from './nats-wrapper/nats-client';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
const PORT = 3000;

const initService = async () => {
  // NATS Init
  await natsClient
    .connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    )
    .catch(() => console.log('Trying to connect...'));

  await mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => console.log('Connected to MongoDb'))
    .catch(err => console.log(err));

  if (natsClient.client) {
    natsClient.client?.on('close', () => {
      console.log('NATS connection is closed');
      process.exit();
    });

    new OrderCreatedListener(natsClient.getClient()).listen();
    new OrderCancelledListener(natsClient.getClient()).listen();

    process.on('SIGINT', () => natsClient.client?.close());

    process.on('SIGTERM', () => natsClient.client?.close());
  }

  app.listen(PORT);
  console.log(`Server started on port ${PORT}`);
};

initService();
