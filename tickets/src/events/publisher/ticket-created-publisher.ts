import {
  Publisher,
  TicketCreatedEventType,
  Channels,
} from '@adar-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEventType> {
  channel: TicketCreatedEventType['channel'] = Channels.TICKET_CREATED;
}
