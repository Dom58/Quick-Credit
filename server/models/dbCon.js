import {Pool} from 'pg';
import dotenv from 'dotenv'
// import config from '../config/config'
// console.log(config);


dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
pool.on('connect', () => console.log('Connected to database...'));

export default pool

// import { Pool } from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// let pool = {}

// if (process.env.NODE_ENV === 'DEV') {
//   pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//   });
//   pool.on('connect', () => console.log('Connected to database...'));
// }

// if (process.env.NODE_ENV === 'TEST') {
//   pool = new Pool({
//     connectionString: process.env.DATABASE_URL_TEST,
//   });
//   pool.on('connect', () => console.log('Connected to database...'));
// }
// export default pool;