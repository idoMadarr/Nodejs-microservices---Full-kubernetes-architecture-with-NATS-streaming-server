import {
  Listener,
  Channels,
  OrderCreatedEventType,
} from '@adar-tickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/Ticket';
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEventType> {
  channel: OrderCreatedEventType['channel'] = Channels.ORDER_CREATED;
  queueGroup = 'tickets-service';

  async onMessage(data: OrderCreatedEventType['data'], msg: Message) {
    const { ticket, id } = data;

    const selectedTicket = await Ticket.findById(ticket.id);

    if (!selectedTicket) throw new Error('Ticket not found');

    selectedTicket.set({ orderId: id });
    await selectedTicket.save();

    // We publishing event from inside a listener.
    // The goal is to keep ticket docuemnt versions (inside order serivce) async between our services
    await new TicketUpdatedPublisher(this.client).publish({
      id: selectedTicket.id,
      title: selectedTicket.title,
      price: selectedTicket.price,
      userId: selectedTicket.userId,
      version: selectedTicket.version,
      orderId: selectedTicket.orderId,
    });

    msg.ack();
  }
}
