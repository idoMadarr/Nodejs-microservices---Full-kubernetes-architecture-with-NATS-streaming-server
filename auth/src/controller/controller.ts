import { RequestHandler } from 'express';
import { sign, JwtPayload } from 'jsonwebtoken';
import { BadRequestError } from '@adar-tickets/common';
import { User } from '../models/User';

export const signUp: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  const existUser = await User.find({ email });

  if (existUser.length) {
    throw new BadRequestError('Email in use');
  }

  const hashingPassword = await User.toHash(password);
  const createUser = User.build({ email, password: hashingPassword });
  await createUser.save();

  const payload: JwtPayload = { id: createUser.id, email: createUser.email };
  const userJwt = sign(payload, process.env.JWT_KEY!);

  // Set a JWT inside a Cookie - We actully send a decoded base 64 object that include our Token (Double encryption)
  req.session = {
    jwt: userJwt,
  };

  res.status(200).send(createUser);
};

export const signIn: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  const existUser = await User.findOne({ email });
  if (!existUser) {
    throw new BadRequestError('Invalid credentials');
  }

  const passwordMatch = await User.toCompare(password, existUser.password);
  if (!passwordMatch) {
    throw new BadRequestError('Invalid password, please try again');
  }

  const payload: JwtPayload = { id: existUser.id, email: existUser.email };
  const userJwt = sign(payload, process.env.JWT_KEY!);

  req.session = {
    jwt: userJwt,
  };

  res.status(200).send(existUser);
};

export const signOut: RequestHandler = (req, res, next) => {
  req.session = null;
  res.send({});
};

export const currentUser: RequestHandler = (req, res, next) => {
  res.send({ currentUser: req.currentUser || null });
};
