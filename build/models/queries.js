"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var createUsersTable = "CREATE TABLE IF NOT EXISTS \n                      users (\n                          id SERIAL NOT NULL PRIMARY KEY,\n                          firstname VARCHAR(255) NOT NULL,\n                          lastname VARCHAR(255) NOT NULL,\n                          email VARCHAR(255) UNIQUE NOT NULL,\n                          address VARCHAR(255) NOT NULL,\n                          status VARCHAR(100) NOT NULL,\n                          isadmin boolean NOT NULL,\n                          password VARCHAR(255) NOT NULL,\n                          created_on timestamp without time zone\n                      )";
var createLoansTable = "CREATE TABLE IF NOT EXISTS \n                      loans (\n                          id SERIAL NOT NULL PRIMARY KEY,\n                          email VARCHAR(255) NOT NULL,\n                          status VARCHAR(255) DEFAULT 'pending',\n                          repaid boolean DEFAULT 'false',\n                          amount NUMERIC NOT NULL,\n                          tenor  NUMERIC NOT NULL,\n                          paymentinstallment NUMERIC NOT NULL,\n                          balance NUMERIC NOT NULL,\n                          interest NUMERIC NOT NULL,\n                          created_on timestamp without time zone,\n                          FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE\n                      )";
var createRepaymentTable = "CREATE TABLE IF NOT EXISTS \n                      repayments (\n                          id SERIAL NOT NULL PRIMARY KEY,\n                          loanid integer REFERENCES loans(id),\n                          amount NUMERIC NOT NULL,\n                          monthlypayment NUMERIC NOT NULL,\n                          balance  NUMERIC NOT NULL,\n                          created_on timestamp without time zone\n                      )";
var insertUser = "INSERT INTO users (firstname, lastname, email, address, status,                      isadmin,password, created_on)\n                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)\n                    RETURNING id, firstname, lastname, email, address, status, isadmin";
var insertAdminAccount = "INSERT INTO users (firstname, lastname,email,address,                          status,isadmin, password, created_on) \n                            VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING RETURNING *";
var insertLoan = "INSERT INTO loans (email, status, repaid, amount, tenor,                             paymentinstallment, balance, interest, created_on)\n                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)\n                    RETURNING id, email, status, repaid, amount, tenor, paymentinstallment, balance,interest, created_on";
var insertRepayment = "INSERT INTO repayments (loanid, amount, monthlypayment,                         balance,created_on)\n                        VALUES ($1, $2, $3, $4, $5) \n                        RETURNING * ";
var getAllUsers = "SELECT * FROM users";
var getAllLoans = "SELECT * FROM loans";
var getAllRepayments = "SELECT * FROM repayments";
var fetchOneUser = "SELECT * FROM users WHERE email = $1 ";
var fetchOneLoan = "SELECT * FROM loans WHERE id = $1 ";
var fetchUserWithLoan = "SELECT * FROM loans WHERE email = $1 ";
var fetchOneRepayment = "SELECT * FROM repayments WHERE id = $1 ";
var getRepaidLoans = "SELECT * FROM loans WHERE status = $1 AND                                 repaid= $2 ";
var updateUser = "UPDATE users SET status = $2 WHERE email = $1 RETURNING * ";
var updateLoan = "UPDATE loans SET status = $2 WHERE id = $1\n                    RETURNING * ";
var updateLoanAfterHighRepayment = "UPDATE loans SET balance = $2, repaid = $3                                    WHERE id = $1\n                                    RETURNING * ";
var updateLoanAfterLowRepayment = "UPDATE loans SET balance = $2 WHERE id = $1\n                                    RETURNING * ";
var deleteAllUsersDuringTesting = "TRUNCATE users CASCADE";
var dropTables = "DROP TABLE IF EXISTS \n                      users, loans, repayments";
var _default = {
  createUsersTable: createUsersTable,
  createLoansTable: createLoansTable,
  createRepaymentTable: createRepaymentTable,
  insertUser: insertUser,
  insertAdminAccount: insertAdminAccount,
  insertLoan: insertLoan,
  insertRepayment: insertRepayment,
  getAllUsers: getAllUsers,
  getAllLoans: getAllLoans,
  getAllRepayments: getAllRepayments,
  fetchOneUser: fetchOneUser,
  fetchOneLoan: fetchOneLoan,
  fetchUserWithLoan: fetchUserWithLoan,
  fetchOneRepayment: fetchOneRepayment,
  getRepaidLoans: getRepaidLoans,
  updateUser: updateUser,
  updateLoan: updateLoan,
  updateLoanAfterHighRepayment: updateLoanAfterHighRepayment,
  updateLoanAfterLowRepayment: updateLoanAfterLowRepayment,
  deleteAllUsersDuringTesting: deleteAllUsersDuringTesting,
  dropTables: dropTables
};
exports["default"] = _default;
