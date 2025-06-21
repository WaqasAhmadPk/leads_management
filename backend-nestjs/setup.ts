import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
  const {
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
  } = process.env;

  const client = new Client({
    user: DB_USERNAME,
    host: DB_HOST,
    password: DB_PASSWORD,
    port: Number(DB_PORT),
    database: 'postgres', // connect to default DB to run CREATE DATABASE
  });

  try {
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'`);
    
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`✅ Database "${DB_NAME}" created successfully.`);
    } else {
      console.log(`ℹ️ Database "${DB_NAME}" already exists. Skipping creation.`);
    }
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
  } finally {
    await client.end();
  }
}

createDatabase();
