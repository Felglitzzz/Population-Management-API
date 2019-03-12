/* eslint-disable no-unused-vars */
import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';
import Database from './database';

const PORT = process.env.PORT || 3000;

const app = express();

// Set up database with mongoose
const instance = new Database();

app.use(bodyParser.json());

app.use('/api/v1', router);

const server = app.listen(PORT, () => {
  console.log(`Population-Management-API listening on port http://localhost:${PORT}/api/v1/home`);
});

const shutdown = (err) => {
  if (err) console.error(err);
  server.close();
  process.exit(1);
};

process.on('uncaughtException', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('unhandledRejection', shutdown);
