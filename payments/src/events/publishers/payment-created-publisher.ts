import { Publisher, PaymentCreatedType, Channels } from '@adar-tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedType> {
  channel: PaymentCreatedType['channel'] = Channels.PAYMENT_CREATED;
}
