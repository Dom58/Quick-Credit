import bcrypt from 'bcrypt'
import pool from './dbCon';
import DropTable from './queries'

const dropTables = async () => {
    await pool.query(DropTable.deleteAllUsersDuringTesting);
  console.log('Three Tables (users, loans,repayment) Resetted !!');
};

(async () => {
  await pool.query(dropTables);
})().catch(error =>console.log(error))

export default dropTables;

