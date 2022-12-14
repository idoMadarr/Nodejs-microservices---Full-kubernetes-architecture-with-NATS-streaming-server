import {
  Listener,
  Channels,
  OrderCancelledEventType,
} from '@adar-tickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/Ticket';
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEventType> {
  channel: OrderCancelledEventType['channel'] = Channels.ORDER_CANCELLED;
  queueGroup = 'tickets-service';

  async onMessage(data: OrderCancelledEventType['data'], msg: Message) {
    const { ticket } = data;

    const updatedTicket = await Ticket.findById(ticket.id);

    if (!updatedTicket) throw new Error('Ticket not found');

    updatedTicket.set({ orderId: undefined });
    await updatedTicket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: updatedTicket.id,
      title: updatedTicket.title,
      price: updatedTicket.price,
      userId: updatedTicket.userId,
      version: updatedTicket.version,
      orderId: updatedTicket.orderId,
    });

    msg.ack();
  }
}
