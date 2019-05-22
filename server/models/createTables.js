import bcrypt from 'bcrypt'
import pool from './dbCon';
import CreateTable from './queries'
import dotenv from 'dotenv'

dotenv.config()

const createTables = async () => {
  await pool.query(CreateTable. createUsersTable);
  await pool.query(CreateTable.createLoansTable);
  await pool.query(CreateTable.createRepaymentTable);
  console.log('Three Tables created successfully');
};

(async () => {
  await pool.query(createTables);
})().catch(error =>console.log(error))

export default createTables;

