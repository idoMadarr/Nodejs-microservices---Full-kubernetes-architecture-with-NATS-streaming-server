// By defult throwing error is not possible with async function, it can lead to non-response behavior
// For fixing this issue we should just install and import express-async-errors.

import express from 'express';
import cookieSession from 'cookie-session';
import 'express-async-errors';

import { authRoutes } from './routes/routes';
import { errorMiddleware, NotFoundError } from '@adar-tickets/common';

const app = express();
app.set('trust proxy', true); // Extra implemention for ingress-nginx combined with cookie
app.use(express.json());
app.use(
  cookieSession({
    signed: false, // Disable encryption on the cookie - we dont need it beacuse we have JWT
    secure: process.env.NODE_ENV !== 'test', // Anable cookie only for HTTPS connection (jest & supertest in not allowed for ex.)
  })
);

app.use('/api/users', authRoutes);
app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorMiddleware);

export { app };
