import {
  Listener,
  Channels,
  OrderCancelledEventType,
  OrderStatus,
} from '@adar-tickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Order';

export class OrderCancelledListener extends Listener<OrderCancelledEventType> {
  channel: OrderCancelledEventType['channel'] = Channels.ORDER_CANCELLED;
  queueGroup = 'payments-service';

  async onMessage(data: OrderCancelledEventType['data'], msg: Message) {
    const { id } = data;

    const updatedOrder = await Order.findById(id);

    if (!updatedOrder) throw new Error('Order not found');

    updatedOrder?.set({ status: OrderStatus.CANCELLED });
    await updatedOrder?.save();

    msg.ack();
  }
}
