import { app } from './app';
import mongoose from 'mongoose';
const PORT = 3000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT);
    console.log(`Server started on port ${PORT}`);
  })
  .catch(err => {
    console.error(err);
  });
