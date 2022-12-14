import { Schema, model, Model, Document, ObjectId } from 'mongoose';

interface PaymentCredentials {
  orderId: string;
  stripedId: string;
}

interface PaymentModel extends Model<PaymentDoc> {
  build(credentials: PaymentCredentials): PaymentDoc;
}

// NOTICE: We dont need to set version implementaion beacuse the documents inside this collection will never change after created.
// So we'll not need here any async event implementation.
interface PaymentDoc extends Document {
  _id: ObjectId;
  orderId: string;
  stripedId: string;
}

const paymentSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripedId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

paymentSchema.statics.build = (credentials: PaymentCredentials) =>
  new Payment(credentials);

export const Payment = model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
);
