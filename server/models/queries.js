const createUsersTable = `CREATE TABLE IF NOT EXISTS 
                      users (
                          id SERIAL NOT NULL PRIMARY KEY,
                          firstname VARCHAR(255) NOT NULL,
                          lastname VARCHAR(255) NOT NULL,
                          email VARCHAR(255) UNIQUE NOT NULL,
                          address VARCHAR(255) NOT NULL,
                          status VARCHAR(100) NOT NULL,
                          isadmin boolean NOT NULL,
                          password VARCHAR(255) NOT NULL,
                          created_on timestamp without time zone
                      )`;
const createLoansTable = `CREATE TABLE IF NOT EXISTS 
                      loans (
                          id SERIAL NOT NULL PRIMARY KEY,
                          email VARCHAR(255) NOT NULL,
                          status VARCHAR(255) DEFAULT 'pending',
                          repaid boolean DEFAULT 'false',
                          amount NUMERIC NOT NULL,
                          tenor  NUMERIC NOT NULL,
                          paymentinstallment NUMERIC NOT NULL,
                          balance NUMERIC NOT NULL,
                          interest NUMERIC NOT NULL,
                          created_on timestamp without time zone,
                          FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
                      )`;
                      
const createRepaymentTable = `CREATE TABLE IF NOT EXISTS 
                      repayments (
                          id SERIAL NOT NULL PRIMARY KEY,
                          loanid integer REFERENCES loans(id),
                          amount NUMERIC NOT NULL,
                          monthlypayment NUMERIC NOT NULL,
                          balance  NUMERIC NOT NULL,
                          created_on timestamp without time zone
                      )`;

const insertUser = `INSERT INTO users (firstname, lastname, email, address, status,                      isadmin,password, created_on)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING id, firstname, lastname, email, address, status, isadmin`;
const insertAdminAccount = `INSERT INTO users (firstname, lastname,email,address,                          status,isadmin, password, created_on) 
                            VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING RETURNING *`;

const insertLoan = `INSERT INTO loans (email, status, repaid, amount, tenor,                             paymentinstallment, balance, interest, created_on)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                    RETURNING id, email, status, repaid, amount, tenor, paymentinstallment, balance,interest, created_on`;

const insertRepayment = `INSERT INTO repayments (loanid, amount, monthlypayment,                         balance,created_on)
                        VALUES ($1, $2, $3, $4, $5) 
                        RETURNING * `;

const getAllUsers = `SELECT * FROM users`;
const getAllLoans = `SELECT * FROM loans`;
const getAllRepayments = `SELECT * FROM repayments`;

const fetchOneUser = `SELECT * FROM users WHERE email = $1 `;
const fetchOneLoan = `SELECT * FROM loans WHERE id = $1 `;
const fetchUserWithLoan = `SELECT * FROM loans WHERE email = $1 `;
const fetchOneRepayment = `SELECT * FROM repayments WHERE id = $1 `;

const getCurrentLoans = `SELECT * FROM loans WHERE status = 'approved' AND                                   repaid='false' `;
const getRepaidLoans = `SELECT * FROM loans WHERE status = 'approved' AND                                 repaid='true `;

const updateUser = `UPDATE users SET status = $2 WHERE email = $1 RETURNING * `;
const updateLoan = `UPDATE loans SET status = $2 WHERE id = $1
                    RETURNING * `;

const updateLoanAfterHighRepayment = `UPDATE loans SET balance = $2, repaid = $3                                    WHERE id = $1
                                    RETURNING * `;
const updateLoanAfterLowRepayment = `UPDATE loans SET balance = $2 WHERE id = $1
                                    RETURNING * `;

const dropTables = `DROP TABLE IF EXISTS 
                      users, loans, repayments`;

export default {
  createUsersTable,
  createLoansTable,
  createRepaymentTable,
  insertUser,
  insertAdminAccount,
  insertLoan,
  insertRepayment,
  getAllUsers,
  getAllLoans,
  getAllRepayments,
  fetchOneUser,
  fetchOneLoan,
  fetchUserWithLoan,
  fetchOneRepayment,
  getCurrentLoans,
  getRepaidLoans,
  updateUser,
  updateLoan,
  updateLoanAfterHighRepayment,
  updateLoanAfterLowRepayment,
  dropTables
};

