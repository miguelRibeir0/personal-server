import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function connect() {
  const client = new MongoClient(process.env.MONGO_URL);
  try {
    await client.connect();
    const db = client.db('AI-BATTLE');
    const collection = db.collection('Battles');
    return { client, collection };
  } catch (error) {
    console.error('Connection error:', error);
    throw error;
  }
}

const getBattles = async () => {
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

const startBattle = async () => {
  let client;
  try {
    const connection = await connect();
    client = connection.client;
    const collection = connection.collection;

    const result = await collection.insertOne({
      battle_1: {
        model: null,
        round_1: {
          model_a: null,
          model_b: null,
          winner: null,
          judge: 'user',
          prompt: null,
          model_a_answer: null,
          model_b_answer: null,
        },
        round_2: {
          model_a: null,
          model_b: null,
          winner: null,
          judge: 'user',
          prompt: null,
          model_a_answer: null,
          model_b_answer: null,
        },
        round_3: {
          model_a: null,
          model_b: null,
          winner: null,
          judge: 'user',
          prompt: null,
          model_a_answer: null,
          model_b_answer: null,
        },
      },
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

const updateBattle = async (
  userId,
  battleCount,
  round,
  modelA,
  modelB,
  winner,
  prompt,
  a_answer,
  b_answer
) => {
  let client;
  try {
    const connection = await connect();
    client = connection.client;
    const collection = connection.collection; // Correctly access the collection

    await collection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          [`battle_${battleCount + 1}.model`]: modelA,
          [`battle_${battleCount + 1}.round_${round + 1}.model_a`]: modelA,
          [`battle_${battleCount + 1}.round_${round + 1}.model_b`]: modelB,
          [`battle_${battleCount + 1}.round_${round + 1}.winner`]: winner,
          [`battle_${battleCount + 1}.round_${round + 1}.prompt`]: prompt,
          [`battle_${battleCount + 1}.round_${round + 1}.model_a_answer`]:
            a_answer,
          [`battle_${battleCount + 1}.round_${round + 1}.model_b_answer`]:
            b_answer,
        },
      }
    );
  } catch (error) {
    console.error('Error details:', error);
    throw new Error('DB update error');
  } finally {
    if (client) {
      await client.close();
    }
  }
};

export { startBattle, updateBattle, getBattles };
