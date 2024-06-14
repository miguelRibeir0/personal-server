import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const connect = async () => {
  try {
    console.log('Connecting to database:', process.env.MONGO_URL);
    const client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected');
    return client.db('AI-BATTLE').collection('Battles');
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw new Error('DB connection error');
  }
};

const getBattles = async () => {
  try {
    const collection = await connect();
    const result = await collection.find({}).toArray();
    return result;
  } catch (error) {
    console.error('Error fetching battles:', error);
    throw new Error('DB query error');
  }
};

const startBattle = async () => {
  try {
    const collection = await connect();
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
    console.error('Error starting new battle:', error);
    throw new Error('DB insert error');
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
    const collection = await connect();
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
    console.error('Error updating battle:', error);
    throw new Error('DB update error');
  }
};

export { startBattle, updateBattle, getBattles };
