import Queue from 'bull';
import { natsClient } from '../nats-wrapper/nats-client';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';

interface JobPayload {
  orderId: string;
}

export const expirationQueue = new Queue<JobPayload>('order:expiratn', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async job => {
  new ExpirationCompletePublisher(natsClient.getClient()).publish({
    orderId: job.data.orderId,
  });
});
