import {
  Listener,
  Channels,
  PaymentCreatedType,
  OrderStatus,
} from '@adar-tickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Order';

// Ideally, when we update an order we should use the version as well.
// The thing is, that after updating an order to status Complleted it will never change again.
export class PaymentCreatedLister extends Listener<PaymentCreatedType> {
  channel: PaymentCreatedType['channel'] = Channels.PAYMENT_CREATED;
  queueGroup = 'order-service';

  async onMessage(data: PaymentCreatedType['data'], msg: Message) {
    const { orderId } = data;

    const updateOrder = await Order.findById(orderId);

    if (!updateOrder) throw new Error('Order not found');

    updateOrder.set({ status: OrderStatus.COMPLETED });
    await updateOrder.save();

    msg.ack();
  }
}
