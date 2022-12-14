import {
  Listener,
  Channels,
  TicketUpdatedEventType,
} from '@adar-tickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/Ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEventType> {
  channel: TicketUpdatedEventType['channel'] = Channels.TICKET_UPDATED;
  queueGroup = 'order-service';

  async onMessage(data: TicketUpdatedEventType['data'], msg: Message) {
    const { title, price } = data;

    // Here we are going to match our recorde's versions, and only if there's a match we'll acknowledge the event
    // const ticket = await Ticket.findOne({ _id: data.id, version: data.version - 1 });
    const ticket = await Ticket.findByNATS(data);

    if (ticket) {
      ticket?.set({ title, price });
      await ticket?.save();
      msg.ack();
    } else {
      throw new Error('Ticket not found');
    }
  }
}
