import bcrypt from 'bcrypt'
import pool from '../app'
import DropTable from './queries'

const dropTables = async () => {
  await pool.query(DropTable.dropTables);
  console.log('Three Tables (users, loans,repayment) tables. Deleted Successfully !!');
};

(async () => {
  await pool.query(dropTables);
})().catch(error =>console.log(error))

export default dropTables;
