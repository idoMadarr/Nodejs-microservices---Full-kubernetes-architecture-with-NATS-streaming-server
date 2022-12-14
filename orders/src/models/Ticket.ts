// NOTICE: This is NOT code duplication from the tickets service.
// Keepm in mind that thie model and its credentials are relevent only for order service
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Schema, model, Model, Document, ObjectId } from 'mongoose';
import { Order } from './Order';
import { OrderStatus } from '@adar-tickets/common';

interface TicketCredentials {
  id: string;
  title: string;
  price: number;
}

interface TicketModel extends Model<TicketDoc> {
  build(credentials: TicketCredentials): TicketDoc;
  // We can use this method to dynamicly select event from the listeners
  findByNATS(event: { id: string; version: number }): Promise<TicketDoc | null>;
}

// NOTICE: 'build' and 'findByNATS' is a method that we set on the Model itself
// 'isReserved' on the other hand is a method that we set on evrey instance
export interface TicketDoc extends Document {
  _id: ObjectId;
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<Boolean>;
}

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(roc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (credentials: TicketCredentials) =>
  new Ticket({
    _id: credentials.id,
    title: credentials.title,
    price: credentials.price,
  });

ticketSchema.statics.findByNATS = async (event: {
  id: string;
  version: number;
}) => {
  const ticket = await Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
  return ticket;
};

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [OrderStatus.CREATED, OrderStatus.PENDING, OrderStatus.COMPLETED],
    },
  });

  // Just an alegant way to return true/false according to the result of the serach
  return !!existingOrder;
};

export const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);
