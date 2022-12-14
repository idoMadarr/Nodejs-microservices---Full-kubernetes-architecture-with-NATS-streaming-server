// - Optimistic Concurrency Control -
// mongoose-update-if-current is a package for dealing concurrency issues
// our approuch is to set a 'version' property to every single document that we save on our database
// after that, every time that we want to update a docuemnt, mongoose-update-if-current will look not only for id (to update specific docuemnt) but also number version
// NOTICE: MongoDB recoreds hold by defulat __v property - it's ment to be for that specific porpuse
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Schema, model, Model, Document, ObjectId } from 'mongoose';

interface TicketCredentials {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends Model<TicketDoc> {
  build(credentials: TicketCredentials): TicketDoc;
}

interface TicketDoc extends Document {
  _id: ObjectId;
  title: string;
  price: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  orderId?: string; // orderId is not going to define when a ticket is created
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
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// Changing the __v to version
ticketSchema.set('versionKey', 'version');
// mongoose-update-if-current configuration
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (credentials: TicketCredentials) =>
  new Ticket(credentials);

export const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);
