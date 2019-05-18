import bcrypt from 'bcrypt'
import pool from './dbCon';
import CreateTable from './queries'
import dotenv from 'dotenv'

dotenv.config()

const adminData = {
  firstname: 'Dominique',
  lastname: 'Xavier58',
  email: 'admin@gmail.com',
  address: 'Kigali/Gasabo',
  status: 'verified',
  isadmin: 'true',
  password: bcrypt.hashSync(`${process.env.ADMIN_PASSWORD_STRING }`, 10),
  created_on: new Date(),
};

const createTables = async () => {
  await pool.query(CreateTable. createUsersTable);
  await pool.query(CreateTable.createLoansTable);
  await pool.query(CreateTable.createRepaymentTable);
  
  await pool.query(CreateTable.insertAdminAccount, [adminData.firstname, adminData.lastname,adminData.email,adminData.address,adminData.status,adminData.isadmin, adminData.password, adminData.created_on])
  console.log('Three Tables and admin account created successfully');
};

(async () => {
  await pool.query(createTables);
})().catch(error =>console.log(error))

export default createTables;
