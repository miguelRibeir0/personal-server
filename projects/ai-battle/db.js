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

const startBattle = async (
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
    const collection = connection.collection;

    const result = await collection.insertOne({
      prompt: prompt,
      model_a: modelA,
      model_b: modelB,
      winner: winner,
      judge: 'user',
      model_a_answer: a_answer,
      model_b_answer: b_answer,
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

// const updateBattle = async (
//   userId,
//   // battleCount,
//   // round,
//   modelA,
//   modelB,
//   winner,
//   prompt,
//   a_answer,
//   b_answer
// ) => {
//   let client;
//   try {
//     const connection = await connect();
//     client = connection.client;
//     const collection = connection.collection; // Correctly access the collection

//     await collection.updateOne(
//       { _id: new ObjectId(userId) },
//       {
//         $set: {
//           prompt: prompt,
//           model_a: modelA,
//           model_b: modelB,
//           winner: winner,
//           model_a_answer: a_answer,
//           model_b_answer: b_answer,
//         },
//       }
//     );
//   } catch (error) {
//     console.error('Error details:', error);
//     throw new Error('DB update error');
//   } finally {
//     if (client) {
//       await client.close();
//     }
//   }
// };

export { startBattle, getBattles };
