[![Build Status](https://travis-ci.com/Dom58/Quick-Credit.svg?branch=develop)](https://travis-ci.com/Dom58/Quick-Credit)  [![Coverage Status](https://coveralls.io/repos/github/Dom58/Quick-Credit/badge.svg?branch=develop)](https://coveralls.io/github/Dom58/Quick-Credit?branch=develop)

# Quick-Credit
Quick Credit is an online web lending platform that provides short term soft loans to individuals. This helps solve problems of financial inclusion as a way to alleviate poverty and empower low income earners.

<p> User is able to navigate the different web pages of Quick credit application </p>
<p> User is able to apply for loan at their home </p>

# Setup
## UI
* Clone the application with `git clone` command and after go and paste the link of clonning the repo or download the develop branch or gh-pages branch and enter in UI directory to view different html pages like index page,...

## finished API Endpoints
- You need to have `git`, `NodeJS` and `NPM` installed on your local environment.
- Clone the application with `git clone` command and after go and paste the link of clonning the repo
- `npm install` to install all the dependencies in local environment
- `npm update` updating the dependencies if any.
### API
* POST `/api/v1/auth/signup` signup on Quick credit application.
* POST `/api/v1/auth/signin` signin on Quick credit application.
* GET `/api/v1/auth/users` all users on Quick credit application.
* PATCH `/api/v1/users/:email/verify` verify a user of Quick credit application.

* POST `/api/v1/loans` apply for loan.
* GET `/api/v1/loans` get all loan applications.
* GET `/api/v1/loans/:id` get a specific loan application.
* PATCH `/api/v1/loans/:id` approve /reject loan application.
* POST `/api/v1/loans/:id/repayment` post repayment transaction loan.

* GET `/api/v1/repayments/loans` get all loan repayment.
* GET `/api/v1/loans/current/loans` get or filter all current loan applications.
* GET `/api/v1/loans/repaid/loans` get or filter all repaid loan applications.

# To Getting Started
Starting application run the following npm command
* `npm run server` for starting the server.
# For Testing
Not yet finnished [ waiting the update]

# HEROKU 
Not yet deployed [ waiting the update]/

# Github-page
GitHub page (gh-page) for this web project Quick credit web application n will be accessed using this link: https://dom58.github.io/Quick-Credit/ui
and use the dummy  email ( admin@gmail.com ) to view different admin UI dashboard page(s) and an password to access as an admin and may use any email like (username@example.com) to view a user UI dashboard page(s).

