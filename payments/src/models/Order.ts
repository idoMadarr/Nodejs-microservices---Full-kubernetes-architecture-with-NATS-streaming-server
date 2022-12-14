import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Schema, model, Model, Document } from 'mongoose';
import { OrderStatus } from '@adar-tickets/common';

interface OrderCredentials {
  id: string;
  price: number;
  userId: string;
  status: OrderStatus;
  version: number;
}

interface OrderModel extends Model<OrderDoc> {
  build(credentials: OrderCredentials): OrderDoc;
}

// NOTICE: Here we are not specifing "id" beacuse the id referce to the id inside orders service
interface OrderDoc extends Document {
  price: number;
  userId: string;
  status: OrderStatus;
  version: number;
}

const orderSchema = new Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
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
  new Order({
    _id: credentials.id,
    price: credentials.price,
    status: credentials.status,
    userId: credentials.userId,
    version: credentials.version,
  });

export const Order = model<OrderDoc, OrderModel>('Order', orderSchema);
