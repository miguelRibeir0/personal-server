import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const connect = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error('error:', error);
    throw error;
  }
};

const getUsers = async () => {
  let client;
  try {
    client = await connect();

    const result = await client.query('SELECT * FROM users');
    return result.rows;
  } catch (error) {
    console.error('DB query error:', error);
    throw new Error('DB query error');
  } finally {
    if (client) {
      client.release();
    }
  }
};

const newUser = async (username, password) => {
  let client;
  try {
    client = await connect();

    const values = [username, password];
    const query =
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id';
    const result = await client.query(query, values);

    return result.rows[0].id;
  } catch (error) {
    throw new Error(`DB insert error: ${error.message}`);
  } finally {
    if (client) {
      client.release();
    }
  }
};

const addProduct = async (
  productName,
  price,
  quantity,
  productStatus,
  date
) => {
  let client;
  try {
    client = await connect();

    const values = [productName, price, quantity, productStatus, date];
    const query =
      'INSERT INTO products (name,price,quantity,status,date) VALUES ($1, $2, $3, $4, $5) RETURNING id';
    const result = await client.query(query, values);

    return result.rows[0].id;
  } catch (error) {
    throw new Error(`DB insert error: ${error.message}`);
  } finally {
    if (client) {
      client.release();
    }
  }
};

const getDefaultProducts = async () => {
  let client;
  try {
    client = await connect();

    const result = await client.query(
      'SELECT * FROM products WHERE is_default = true'
    );
    return result.rows;
  } catch (error) {
    console.error('DB query error:', error);
    throw new Error('DB query error');
  } finally {
    if (client) {
      client.release();
    }
  }
};

const insertUserProducts = async (userId, productId) => {
  let client;

  try {
    client = await connect();
    const values = [userId, productId];
    const query =
      'INSERT INTO user_products (user_id, product_id) VALUES ($1, $2)';
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('error:', error);
  } finally {
    if (client) {
      client.release();
    }
  }
};

const getUserProducts = async (userId) => {
  let client;
  try {
    if (userId === null || isNaN(parseInt(userId))) {
      throw new Error('userId can´t be null');
    }

    client = await connect();
    const values = [userId];
    const query = `
      SELECT products.id, products.name, products.price, products.quantity, products.status, products.date
      FROM user_products
      JOIN products ON user_products.product_id = products.id
      WHERE user_products.user_id = $1
    `;
    const result = await client.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('error:', error);
  } finally {
    if (client) {
      client.release();
    }
  }
};

export {
  getUsers,
  newUser,
  addProduct,
  getDefaultProducts,
  insertUserProducts,
  getUserProducts,
};
