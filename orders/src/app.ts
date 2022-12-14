import express from 'express';
import cookieSession from 'cookie-session';
import 'express-async-errors';

import { ordersRoutes } from './routes/routes';
import { errorMiddleware, NotFoundError } from '@adar-tickets/common';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use('/api/orders', ordersRoutes);

app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorMiddleware);

export { app };
