import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { startBattle, getBattles } from './projects/ai-battle/db.js';
import {
  getUsers,
  newUser,
  addProduct,
  getDefaultProducts,
  insertUserProducts,
  getUserProducts,
  updateUserProducts,
  deleteUserProducts,
  getUserInfo,
  updateUserInfo,
  allProducts,
} from './projects/.admin/db.js';

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
    const id = await startBattle(
      req.body.modelA,
      req.body.modelB,
      req.body.winner,
      req.body.prompt,
      req.body.a_answer,
      req.body.b_answer
    );
    res.json({ id });
  } catch (error) {
    console.error('Error starting new battle:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// server.put('/ai-battles/battles/update', async (req, res) => {
//   try {
//     await updateBattle(
//       req.body.userId,
//       req.body.modelA,
//       req.body.modelB,
//       req.body.winner,
//       req.body.prompt,
//       req.body.a_answer,
//       req.body.b_answer
//     );
//     res.send('Battle updated');
//   } catch (error) {
//     console.error('Error updating battle:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

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
server.get('/.admin/users/:id', async (req, res) => {
  try {
    const user = await getUserInfo(req.params.id);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
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

server.put('/.admin/users/update', async (req, res) => {
  try {
    await updateUserInfo(req.body.id, req.body.username, req.body.password);
    res.json({ Success: 'User updated' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

server.get('/.admin/products', async (req, res) => {
  try {
    const products = await getDefaultProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

server.post('/.admin/products/new', async (req, res) => {
  try {
    const id = await addProduct(
      req.body.name,
      req.body.price,
      req.body.quantity,
      req.body.status,
      req.body.date
    );
    res.json({ id });
  } catch (error) {
    console.error('Error creating new product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

server.post('/.admin/user-products/new', async (req, res) => {
  try {
    const id = await insertUserProducts(req.body.userId, req.body.productId);
    res.json({ id });
  } catch (error) {
    console.error('Error creating new product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

server.get('/.admin/user-products/:userId', async (req, res) => {
  try {
    const products = await getUserProducts(req.params.userId);
    res.json(products);
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

server.put('/.admin/products/update', async (req, res) => {
  try {
    await updateUserProducts(
      req.body.productId,
      req.body.pName,
      req.body.pPrice,
      req.body.pQuantity,
      req.body.pStatus
    );
    res.json({ Success: 'Product updated' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

server.delete('/.admin/products/delete', async (req, res) => {
  try {
    await deleteUserProducts(req.body.productId);
    res.json({ Success: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

server.get('/.admin/all-products', async (req, res) => {
  try {
    const product = await allProducts();
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// --------------------------------------------------------

server.listen(4242);
