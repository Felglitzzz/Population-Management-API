import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const {
  env: {
    DATABASE_SERVER,
    DATABASE_NAME,
  },
} = process;


class Database {
  constructor() {
    this.server = DATABASE_SERVER;
    this.dbName = DATABASE_NAME;
    this.databaseUrl = this.getDatabaseUrl();
    this.connect();
  }

  async connect() {
    await mongoose.connect(this.databaseUrl, { useNewUrlParser: true });
    console.log('connected to database successfully');
  }

  getDatabaseUrl() {
    return `mongodb://${this.server}/${this.dbName}`;
  }
}

export default Database;
