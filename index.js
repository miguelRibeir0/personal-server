import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  startBattle,
  updateBattle,
  getBattles,
} from './projects/ai-battle/db.js';
import { getUsers, newUser, addProduct } from './projects/.admin/db.js';

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.static('public'));

// AI-BATTLE ⚔️ --------------------------------------------

server.get('/ai-battles/battles', async (req, res) => {
  try {
    const battles = await getBattles();
    res.json(battles);
  } catch (error) {
    console.error('Error fetching battles:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

server.post('/ai-battles/battles/new', async (req, res) => {
  try {
    const id = await startBattle();
    res.json({ id });
  } catch (error) {
    console.error('Error starting new battle:', error);
    res.status(500).json({ error: 'Server error' });
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
    console.error('Error updating battle:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// --------------------------------------------------------

// .admin 🦺 ----------------------------------------------

server.get('/.admin/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

server.post('/.admin/users/new', async (req, res) => {
  try {
    const id = await newUser(req.body.username, req.body.password);
    res.json({ id });
  } catch (error) {
    console.error('Error creating new user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

server.post('/.admin/products/new', async (req, res) => {
  try {
    const id = await addProduct(
      req.body.productName,
      req.body.price,
      req.body.quantity,
      req.body.productStatus
    );
    res.json({ id });
  } catch (error) {
    console.error('Error creating new product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// --------------------------------------------------------

server.listen(4242);
