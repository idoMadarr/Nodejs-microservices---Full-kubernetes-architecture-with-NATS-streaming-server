import { Schema, model, Model, Document, ObjectId } from 'mongoose';
import { hash, compare } from 'bcryptjs';

interface UserCredentials {
  email: string;
  password: string;
}

interface UserModel extends Model<UserDoc> {
  build(credentials: UserCredentials): UserDoc;
  toHash(password: string): string;
  toCompare(storedPassword: string, inputPassword: string): any;
}

interface UserDoc extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    // Formating instances response for ahead
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (credentials: UserCredentials): UserDoc =>
  new User(credentials);

userSchema.statics.toHash = (password: string) => hash(password, 12);

userSchema.statics.toCompare = (
  inputPassword: string,
  storedPassword: string
) => compare(inputPassword, storedPassword);

export const User = model<UserDoc, UserModel>('User', userSchema);
