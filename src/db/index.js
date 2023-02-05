import MongoDB from 'mongodb';
import { DB_ADDRESS, DB_NAME, DB_PORT } from '../config/db';
// This will expose DB and connection to consumers
let connection;
let db;

/**
 * Connects to the database and mutates connection
 * It's usually not a good idea, but simplifies access to asynchronous DB connection
 */

/**const connectToDB = async () => {
  if (!connection) {
    connection = await MongoDB.connect(`mongodb://${DB_ADDRESS}:${DB_PORT}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db(DB_NAME);
  }

  return { connection, db };
};
*/

const connectToDB = async () => {
    const url = `mongodb://${DB_ADDRESS}:${DB_PORT}`;
    const { MongoClient } = MongoDB;
  
    connection = await MongoClient.connect(url, { useUnifiedTopology: true });
    db = connection.db(DB_NAME);
  
    return connection;
  };

export { connectToDB, connection, db };

export default {
  connectToDB,
  connection,
  db,
};
