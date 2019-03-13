/* eslint-disable no-unused-vars */
import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';
import Database from './database';
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3000;

const app = express();

// Set up database with mongoose
if (process.env.NODE_ENV !== 'test') {
  const instance = new Database();
}

app.use(bodyParser.json());

app.use('/api/v1', router);

const server = app.listen(PORT, () => {
  console.log(`Population-Management-API listening on port http://localhost:${PORT}/api/v1/home`);
});

export default app;

