import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function connect() {
  const client = new MongoClient(process.env.MONGO_URL);
  try {
    await client.connect();
    const db = client.db('dotAdmin');
    const collection = db.collection('Users');
    return { client, collection };
  } catch (error) {
    console.error('Connection error:', error);
    throw error;
  }
}

const getUsers = async () => {
  let client;
  try {
    const connection = await connect();
    client = connection.client;

    const collection = connection.collection;
    const result = await collection.find({}).toArray();
    return result;
  } catch (error) {
    throw new Error('DB query error');
  } finally {
    if (client) {
      await client.close();
    }
  }
};

const newUser = async (username, password) => {
  let client;
  try {
    const connection = await connect();
    client = connection.client;
    const collection = connection.collection;

    const result = await collection.insertOne({
      user: username,
      password: password,
    });
    return result.insertedId;
  } catch (error) {
    console.error('Error details:', error);
    throw new Error(`DB insert error: ${error.message}`);
  } finally {
    if (client) {
      await client.close();
    }
  }
};

export { getUsers, newUser };
