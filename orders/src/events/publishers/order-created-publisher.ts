import {
  Publisher,
  OrderCreatedEventType,
  Channels,
} from '@adar-tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEventType> {
  channel: OrderCreatedEventType['channel'] = Channels.ORDER_CREATED;
}
