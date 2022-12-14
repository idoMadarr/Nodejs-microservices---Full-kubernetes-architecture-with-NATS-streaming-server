import {
  Listener,
  Channels,
  OrderCreatedEventType,
} from '@adar-tickets/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEventType> {
  channel: OrderCreatedEventType['channel'] = Channels.ORDER_CREATED;
  queueGroup = 'expiration-service';

  async onMessage(data: OrderCreatedEventType['data'], msg: Message) {
    await expirationQueue.add(
      { orderId: data.id },
      {
        delay: 60000,
      }
    );
    msg.ack();
  }
}
