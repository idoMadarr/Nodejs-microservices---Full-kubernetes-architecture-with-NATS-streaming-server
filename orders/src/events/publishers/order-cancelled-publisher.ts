import {
  Publisher,
  OrderCancelledEventType,
  Channels,
} from '@adar-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEventType> {
  channel: OrderCancelledEventType['channel'] = Channels.ORDER_CANCELLED;
}
