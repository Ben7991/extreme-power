import { PrismaClient } from '@prisma/client';

export class DbConnection {
  private static instance: DbConnection;
  private connection: PrismaClient;

  private constructor() {}

  static getInstance() {
    if (!DbConnection.instance) {
      DbConnection.instance = new DbConnection();
      return DbConnection.instance;
    }

    return DbConnection.instance;
  }

  async open() {
    if (!this.connection) {
      this.connection = new PrismaClient();
      return this.connection;
    }

    await this.connection.$connect();
    return this.connection;
  }

  async close() {
    await this.connection?.$disconnect();
  }
}
