import {Pool} from 'pg';
import dotenv from 'dotenv'

dotenv.config()

let pool = {}

if(process.env.NODE_ENV == 'test'){
pool = new Pool({
  connectionString: process.env.DATABASE_URL_TEST,
})
// console.log("here",process.env.DATABASE_URL_TEST)
}
else if (process.env.NODE_ENV == 'prod') {
pool = new Pool({
  connectionString: process.env.DATABASE_URL_PRO,
})
}
else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
}
pool.on('connect', () => console.log('Connected to database...'));

export default pool
