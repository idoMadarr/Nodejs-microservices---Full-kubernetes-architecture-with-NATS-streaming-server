import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Schema, model, Model, Document, ObjectId } from 'mongoose';
import { OrderStatus } from '@adar-tickets/common';
import { TicketDoc } from './Ticket';

interface OrderCredentials {
  userId: string;
  status: OrderStatus;
  expiresAt: string | Date;
  ticket: TicketDoc;
}

interface OrderModel extends Model<OrderDoc> {
  build(credentials: OrderCredentials): OrderDoc;
}

interface OrderDoc extends Document {
  _id: ObjectId;
  userId: string;
  status: OrderStatus;
  expiresAt: string | Date;
  ticket: TicketDoc;
  version: number;
}

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: OrderStatus.CREATED,
    },
    expiresAt: {
      type: String || Schema.Types.Date,
      required: false,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (credentials: OrderCredentials) =>
  new Order(credentials);

export const Order = model<OrderDoc, OrderModel>('Order', orderSchema);
