import {
  Channels,
  Publisher,
  TicketUpdatedEventType,
} from '@adar-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEventType> {
  channel: TicketUpdatedEventType['channel'] = Channels.TICKET_UPDATED;
}
