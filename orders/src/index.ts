import { app } from './app';
import mongoose from 'mongoose';
import { natsClient } from './nats-wrapper/nats-client';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedLister } from './events/listeners/payment-created-listener';
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

    new TicketCreatedListener(natsClient.getClient()).listen();
    new TicketUpdatedListener(natsClient.getClient()).listen();
    new ExpirationCompleteListener(natsClient.getClient()).listen();
    new PaymentCreatedLister(natsClient.getClient()).listen();

    process.on('SIGINT', () => natsClient.client?.close());

    process.on('SIGTERM', () => natsClient.client?.close());
  }

  app.listen(PORT);
  console.log(`Server started on port ${PORT}`);
};

initService();
