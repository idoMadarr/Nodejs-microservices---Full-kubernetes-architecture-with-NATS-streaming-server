import {
  Listener,
  Channels,
  ExpirationCompleteEventType,
  OrderStatus,
} from '@adar-tickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEventType> {
  channel: ExpirationCompleteEventType['channel'] =
    Channels.EXPIRATION_COMPLETE;
  queueGroup = 'order-service';

  async onMessage(data: ExpirationCompleteEventType['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) throw new Error('Order not found');

    if (order.status === OrderStatus.COMPLETED) {
      return msg.ack();
    }

    order?.set({ status: OrderStatus.CANCELLED });
    await order.save();

    // this.client is available insted of natClient wrapper beacuse we are in Listener environment
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toLocaleString(),
      version: order.version,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    msg.ack();
  }
}
