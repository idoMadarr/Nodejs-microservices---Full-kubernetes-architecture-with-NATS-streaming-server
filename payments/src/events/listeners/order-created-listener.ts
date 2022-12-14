import {
  Listener,
  Channels,
  OrderCreatedEventType,
} from '@adar-tickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Order';

export class OrderCreatedListener extends Listener<OrderCreatedEventType> {
  channel: OrderCreatedEventType['channel'] = Channels.ORDER_CREATED;
  queueGroup = 'payments-service';

  async onMessage(data: OrderCreatedEventType['data'], msg: Message) {
    const { id, userId, ticket, status, version } = data;

    const order = Order.build({
      id,
      price: ticket.price,
      status,
      userId,
      version,
    });
    await order.save();
    console.log(order.status, 'PAYMENTS');

    msg.ack();
  }
}
