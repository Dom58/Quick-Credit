[![Build Status](https://travis-ci.com/Dom58/Quick-Credit.svg?branch=develop)](https://travis-ci.com/Dom58/Quick-Credit)  [![Coverage Status](https://coveralls.io/repos/github/Dom58/Quick-Credit/badge.svg?branch=develop)](https://coveralls.io/github/Dom58/Quick-Credit?branch=develop)   [![Maintainability](https://api.codeclimate.com/v1/badges/ed3b52260c4623237693/maintainability)](https://codeclimate.com/github/Dom58/Quick-Credit/maintainability)


# Quick-Credit
Quick Credit is an online web lending platform that provides short term soft loans to individuals. This helps solve problems of financial inclusion as a way to alleviate poverty and empower low income earners.

## Features
* User/client sign up. 
* User/client sign in. 
* User/client can apply for a loan. 
* User/client can view all loan repayment history. 
* Admin can mark a client as verified after confirming the client’s work or home 
address. 
* Admin can view all loan applications. 
* Admin can view a specific loan application. 
* Admin can view current loans (not fully repaid). 
* Admin can view all repaid loans. 
* Admin can approve or reject a client’s loan application. 
* Admin can post loan repayment transaction in favour of a client.

## Prerequisites
  * Node
  * Postman
  * Postgres
  
## Technology used

### Frontend
  * JavaScript
  * HTML
  * CSS

### Backend
  * Node
  * Express
  * mocha
  * chai
  * joi
  * jsonwebtoken
  * bcrypt
  * swagger
  
## Setup
  1. Clone the repository
     ```https://github.com/Dom58/Quick-Credit```
     
  2. Install dependencies
  
     ```npm install```
     
  3. Start the server
  
     ```npm run server```
  
  4. Use Postman to test api on ```localhost:4000```
  
 ## Run test
 To run the application test run the following command in terminal
 
 ```npm test```

## API Endpoints

### Version 1 Endpoints

| Method         | Endpoint             | Description  |
| ---         |     ---      |          --- |
| POST   | /api/v1/auth/signup     | Create an account   |
| POST     | /api/v1/auth/signin      | Sign in      |
| GET   | /api/v1/auth/users     | Get all users    |
| PATCH     | /api/v1/users/:email/verify       | Verify a user      |
| POST   | /api/v1/loans     | Apply for loan application   |
| GET     | /api/v1/loans      | Get all loan application      |
| GET   | /api/v1/loans/:id     | Get specific loan  application   |
| PATCH     | /api/v1/loans/:id       | Approve /reject loan application      |
| POST   | /api/v1/loans/:id/repayment     | post repayment transaction loan   |
| GET     | /api/v1/loans/:loanId/repayments       | retrieve a single loan repayment history     |
| GET     | /api/v1/repayments/loans      | get all loan repayment history     |
| GET   | /loans?status=approved&repaid=false      | filter all current loan applications   |
| GET     | /loans?status=approved&repaid=true       | filter all repaid loan applications      |

### Version 2 Endpoints

| Method         | Endpoint             | Description  |
| ---         |     ---      |          --- |
| POST   | /api/v2/auth/signup     | Create an account   |
| POST     | /api/v2/auth/signin      | Sign in      |
| GET   | /api/v2/auth/users     | Get all users    |
| PATCH     | /api/v2/users/:email/verify       | Verify a user      |
| POST   | /api/v2/loans     | Apply for loan application   |
| GET     | /api/v2/loans      | Get all loan application      |
| GET   | /api/v2/loans/:id     | Get specific loan  application   |
| PATCH     | /api/v2/loans/:id       | Approve /reject loan application      |
| POST   | /api/v2/loans/:id/repayment     | post repayment transaction loan   |
| GET     | /api/v2/loans/:loanId/repayments       | retrieve a single loan repayment history     |
| GET     | /api/v2/repayments/loans      | get all loan repayment history     |
| GET   | /loans?status=approved&repaid=false      | filter all current loan applications   |
| GET     | /loans?status=approved&repaid=true       | filter all repaid loan applications      |

## HEROKU  & Swagger API Documentation 
Access link : ( https://quick-credit-web.herokuapp.com/ ) followed by the above table endpoints using postman. as an example `https://quick-credit-web.herokuapp.com/api/v1/auth/signin` to signin.
* You may read the quick credit web appication documentation using this Heroku URL [Visit the link]( https://quick-credit-web.herokuapp.com/api/documentations) or copy this link `https://quick-credit-web.herokuapp.com/api/documentations/`

## Github-page
GitHub page (gh-page) for this web project Quick credit web application n will be accessed using this link: (https://dom58.github.io/Quick-Credit/ui ) or simply [click here](https://dom58.github.io/Quick-Credit/ui)
and use the dummy  email ( admin@gmail.com ) to view different admin UI dashboard page(s) and an password to access as an admin and may use any email like (username@example.com) to view a user UI dashboard page(s).

## Hosted application
[Quick Credit website](https://quick-credit-react.herokuapp.com)

## Author
Ndahimana Dominique

