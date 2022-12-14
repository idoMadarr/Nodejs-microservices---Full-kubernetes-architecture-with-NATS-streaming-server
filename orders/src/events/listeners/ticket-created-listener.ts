import {
  Listener,
  Channels,
  TicketCreatedEventType,
} from '@adar-tickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/Ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEventType> {
  channel: TicketCreatedEventType['channel'] = Channels.TICKET_CREATED;
  queueGroup = 'order-service';

  async onMessage(data: TicketCreatedEventType['data'], msg: Message) {
    const { id, title, price } = data;

    const ticket = Ticket.build({ id, title, price });
    await ticket.save();

    msg.ack();
  }
}
