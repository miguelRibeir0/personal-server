import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const connect = () => MongoClient.connect(process.env.MONGO_URL);

const getBattles = async () => {
  try {
    const connection = await connect();

    const collection = connection.db('AI-BATTLE').collection('Battles');
    const result = await collection.find({}).toArray();

    connection.close();

    return result;
  } catch (error) {
    console.error(error);
    throw new Error('DB error');
  }
};

const startBattle = async () => {
  try {
    const connection = await connect();

    const collection = connection.db('AI-BATTLE').collection('Battles');
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

    connection.close();

    return result.insertedId;
  } catch (error) {
    console.error(error);
    throw new Error('DB error');
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
  try {
    const connection = await connect();

    const collection = connection.db('AI-BATTLE').collection('Battles');
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

    connection.close();
  } catch (error) {
    console.error(error);
    throw new Error('DB error');
  }
};

export { startBattle, updateBattle, getBattles };
