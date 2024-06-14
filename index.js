import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.static('public'));

import {
  startBattle,
  updateBattle,
  getBattles,
} from './projects/ai-battle/db.js';

server.get('/ai-battles/battles', async (req, res) => {
  try {
    const battles = await getBattles();
    res.json(battles);
  } catch (error) {
    console.error('Error fetching battles:', error); // Log the error
    res.status(500).send({ error: 'Server error' });
  }
});

server.post('/ai-battles/battles/new', async (req, res) => {
  try {
    let id = await startBattle();
    res.json({ id });
  } catch (error) {
    console.error('Error starting new battle:', error); // Log the error
    res.status(500).send({ error: 'Server error' });
  }
});

server.put('/ai-battles/battles/update', async (req, res) => {
  try {
    await updateBattle(
      req.body.userId,
      req.body.battleCount,
      req.body.round,
      req.body.modelA,
      req.body.modelB,
      req.body.winner,
      req.body.prompt,
      req.body.a_answer,
      req.body.b_answer
    );
    res.send('Battle updated');
  } catch (error) {
    console.error('Error updating battle:', error); // Log the error
    res.status(500).send({ error: 'Server error' });
  }
});

// Add global error handlers
process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

server.listen(4242, () => {
  console.log('Server is listening on port 4242');
});
