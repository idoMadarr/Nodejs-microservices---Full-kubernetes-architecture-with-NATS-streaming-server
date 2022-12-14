import { natsClient } from './nats-wrapper/nats-client';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const initService = async () => {
  // NATS Init
  await natsClient
    .connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    )
    .catch(() => console.log('Trying to connect...'));

  if (natsClient.client) {
    natsClient.client?.on('close', () => {
      console.log('NATS connection is closed');
      process.exit();
    });

    new OrderCreatedListener(natsClient.getClient()).listen();

    process.on('SIGINT', () => natsClient.client?.close());

    process.on('SIGTERM', () => natsClient.client?.close());
  }
};

initService();
