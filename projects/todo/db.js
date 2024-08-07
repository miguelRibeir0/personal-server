import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE2,
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

const getTasks = async () => {
  let client;
  try {
    client = await connect();

    const result = await client.query('SELECT * FROM tasks');
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

const newTask = async (taskName, taskDescription, taskDate, taskUrgency) => {
  let client;
  try {
    client = await connect();
    const values = [taskName, taskDescription, taskDate, taskUrgency];
    const query =
      'INSERT INTO tasks (task_name, task_description, task_date, task_urgency) VALUES ($1, $2, $3, $4) RETURNING id';
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

export { getTasks, newTask };
