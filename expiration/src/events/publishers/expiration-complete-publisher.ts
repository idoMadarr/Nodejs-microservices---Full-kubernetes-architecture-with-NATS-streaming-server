import {
  Publisher,
  ExpirationCompleteEventType,
  Channels,
} from '@adar-tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEventType> {
  channel: ExpirationCompleteEventType['channel'] =
    Channels.EXPIRATION_COMPLETE;
}
