import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const connect = async () => {
  const client = await MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const collection = client.db('AI-BATTLE').collection('Battles');
  return { client, collection }; // Return both client and collection
};

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
    const collection = await connect();
    client = collection.client;

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
    throw new Error('DB insert error');
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
    const collection = await connect();
    client = collection.client;

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
    throw new Error('DB update error');
  } finally {
    if (client) {
      await client.close();
    }
  }
};

export { startBattle, updateBattle, getBattles };
