require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const plaid = require('plaid');
const util = require('util');
const moment = require('moment');
const pg = require('pg');
const { response } = require('express');

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || 'transactions').split(',');
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split( ',');

const client = new plaid.Client({
  clientID: PLAID_CLIENT_ID,
  secret: PLAID_SECRET,
  env: plaid.environments[PLAID_ENV],
  options: {
    version: '2019-05-29',
  },
});

const app = express();
app.use(express.json());
app.use(staticMiddleware);
app.use(express.static('public'));

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});


app.post('/api/budgetbuddy/login', (req, res, next) => {
  const {email , password} = req.body;
  if (!email || !password) {
    throw new ClientError(400, 'invalid login');
  }
  const sql =  `
    select "email", "userId", "accessToken"
    from "users"
    where "email" = $1 and "password" = $2
  `;
  const params = [email, password]
  db.query(sql, params)
    .then(response => {
      const users = response.rows;
      res.status(200).send(users)
    })
    .catch(err => next(err))
})

app.post('/api/budgetbuddy/user-info', (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    throw new ClientError(400, 'email required');
  }
  const sql = `
    select "userId", "accessToken"
    from "users"
    where "email" = $1
  `;
  const params = [email]
  db.query(sql, params)
    .then(response => {
      const users = response.rows;
      res.status(200).send(users)
    })
    .catch(err => next(err))
})

//retrieve access token from db

app.post('/api/budgetbuddy/get_access_token', (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    throw new ClientError(400, 'email required');
  }
  const sql = `
    select "accessToken"
    from "users"
    where "email" = $1
  `;
  const params = [email]
  db.query(sql, params)
    .then(response => {
      const accessToken = response.rows;
      res.status(200).send(accessToken)
    })
    .catch(err => next(err))
})

//retrieve account balances of current user

app.post('/api/budgetbuddy/account_balance', (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    throw new ClientError(400, 'email required');
  }
  const sql = `
    select "a"."accountName", "a"."type", "a"."balance"
    from "accounts" as "a"
    join "users" using ("userId")
    where "users"."email" = $1
  `;
  const params = [email];
  db.query(sql, params)
    .then(response => {
      const accountInfo = response.rows;
      res.status(200).send(accountInfo)
    })
    .catch(err => next(err))
})

//when user refreshed account balances, new values are stored in db

app.post('/api/budgetbuddy/update_account_balance', (req, res, next) => {
  const { plaidId, userId, name, subtype, balances } = req.body;
  if (!plaidId || !userId || !name || !subtype || !balances) {
    throw new ClientError(400, 'missing fields');
  }
  const sql = `
    insert into "accounts" ("account_id", "userId" , "name", "subtype" , "balances")
    values ($1, $2, $3, $4, $5)
    on conflict ("account_id")
    do update set "name" = $3 , "subtype" = $4, "balances" = $5
  `
  const params = [plaidId, userId, name, subtype, balances]
  db.query(sql, params)
    .then(response => {
      const accountInfo = response.rows;
      res.status(200).send(accountInfo)
    })
    .catch(err => next(err))
})

//retrieve current account info from database to render to accounts page

app.post('/api/budgetbuddy/accounts', (req, res, next) => {
  const { userId } = req.body;
  if (!userId ) {
    throw new ClientError(400, 'userId required');
  }
  const sql = `
    select row_to_json("accounts")
    from "accounts"
    where "userId" = $1
  `;
  const params = [userId]
  db.query(sql, params)
    .then(response => {
      const accountInfo = [];
      response.rows.forEach(item => {
        accountInfo.push(item.row_to_json)
      })
      res.status(200).send(accountInfo)
    })
    .catch(err => next(err))
})

//import budget info to db

app.post('/api/budgetbuddy/create_budget', (req, res, next) => {
  const { budgetId, userId, income, savings, staticEx } = req.body;
  if (!userId) {
    throw new ClientError(400, 'userId required');
  }
  const sql = `
    insert into "budgets" ("budgetId", "createdBy", "income", "savings", "static")
    values ($1, $2, $3, $4, $5)
    on conflict ("budgetId")
    do update set "income" = $3, "savings" = $4, "static" = $5;
  `;
  const params = [ budgetId, userId, income, savings, staticEx];
  db.query(sql, params)
    .then(response => {
      const budget = response.rows;
      res.status(200).send(budget)
    })
    .catch(err => next(err))
})



app.post('/api/budgetbuddy/budget_category', (req, res, next) => {
  const { itemId, userId, food, travel, entertainment, healthcare, personal, education, services, misc } = req.body;
  if (!userId) {
    throw new ClientError(400, 'userId required');
  }
  const sql = `
    insert into "budgetCategories" ("itemId", "createdBy", "food", "travel", "entertainment", "healthcare", "personal", "education", "services", "misc")
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    on conflict ("itemId")
    do update set "food" = $3, "travel" = $4, "entertainment" = $5, "healthcare" = $6, "personal" = $7, "education" = $8, "services" = $9, "misc" = $10
  `;
  const params = [itemId, userId, food, travel, entertainment, healthcare, personal, education, services, misc];
  db.query(sql, params)
    .then(response => {
      const budget = response.rows;
      res.status(200).send(budget)
    })
    .catch(err => next(err))
})

//retrieve budget info from db

app.post('/api/budgetbuddy/income', (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    throw new ClientError(400, 'userId required');
  }
  const sql = `
    select row_to_json("budgets")
    from "budgets"
    where "createdBy" = $1
  `;
  const params = [ userId ];
  db.query(sql, params)
    .then(response => {
      if (response.rows.length === 0) {
        const income = response.rows
        res.status(200).send(income)
      } else {
        const income = response.rows[0]['row_to_json'];
        res.status(200).send(income)
      }
    })
    .catch(err => next(err))
})

app.post('/api/budgetbuddy/expenses', (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    throw new ClientError(400, 'userId required');
  }
  const sql = `
    select row_to_json("budgetCategories")
    from "budgetCategories"
    where "createdBy" = $1
  `;
  const params = [userId];
  db.query(sql, params)
    .then(response => {
      if(response.rows.length === 0) {
        const income = response.rows
        res.status(200).send(income)
      } else {
        const income = response.rows[0]['row_to_json']
        res.status(200).send(income)
      }
    })
    .catch(err => next(err))
})


// Create a link token with configs which we can then use to initialize Plaid Link client-side.

app.post('/api/create_link_token', function (request, response, next) {
  const configs = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: 'user-id',
    },
    client_name: 'BudgetBuddy',
    products: PLAID_PRODUCTS,
    country_codes: PLAID_COUNTRY_CODES,
    language: 'en',
  };
  client.createLinkToken(configs, function (error, createTokenResponse) {
    if (error != null) {
      return response.json({
        error: error,
      });
    }
    response.json(createTokenResponse);
  });
});

// Exchange token flow - exchange a Link public_token for access token

app.post('/api/set_access_token', function (request, response, next) {
  const PUBLIC_TOKEN = request.body.token;
  client.exchangePublicToken(PUBLIC_TOKEN, function (error, tokenResponse) {
    if (error != null) {
      return response.json(error)
    }
    response.json({
      access_token: tokenResponse.access_token,
      item_id: tokenResponse.item_id,
      error: null,
    })
  })
})

//import access token to db

app.post('/api/budgetbuddy/save_token', (req, res, next) => {
  const { accessToken, email } = req.body;
  if (!accessToken || !email) {
    throw new ClientError(400, 'invalid access token');
  }
  const sql = `
    update "users"
    set "accessToken" = $1
    where "email" = $2
    returning *
  `;
  const params = [accessToken, email]
  db.query(sql, params)
    .then(response => {
      const token = response.rows;
      res.status(200).send(token)
    })
    .catch(err => next(err))
})


// Retrieve an Item's accounts

app.post('/api/accounts', function (request, response, next) {
  const accessToken = request.body.accessToken;
  client.getAccounts(accessToken, function (error, accountsResponse) {
    if (error != null) {
      return response.json(error)
    }

    response.json(accountsResponse);
  });
});

// Retrieve Transactions for an Item

app.post('/api/transactions', function (req, res, next) {
  // Pull transactions for the Item for the last 30 days
  const { accessToken } = req.body
  const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');
  client.getTransactions(
    accessToken,
    startDate,
    endDate,
    {
      count: 250,
      offset: 0,
    },
    function (error, transactionsResponse) {
      if (error != null) {
        return res.json({error});
      } else {
        res.json(transactionsResponse.transactions);
      }
    }
  );
});

// upload transactions to db

app.post('/api/budgetbuddy/save_transactions', (req, res, next) => {
  const { userId, transactionId, name, month, year, date, amount } = req.body;
  if (!userId) {
    throw new ClientError(400, 'userId required');
  }
  const sql = `
    insert into "transactions" ("transactionId", "userId", "name", "month", "year", "date", "amount")
    values ($1, $2, $3, $4, $5, $6, $7)
    on conflict ("transactionId")
    do update set "name"=$3, "month"=$4, "year"=$5, "date"=$6, "amount"=$7
  `;
  const params = [transactionId, userId, name, month, year, date, amount];
  db.query(sql, params)
    .then(response => {
      const transactions = response.rows
      res.status(200).send(transactions);
    })
    .catch(err => next(err))
})

//export transaction data from db

app.post('/api/budgetbuddy/export_transactions', (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    throw new ClientError(400, 'userId required');
  }
  const sql =  `
    select row_to_json("transactions")
    from "transactions"
    where "userId" = $1
    `;
    const params = [userId]
    db.query(sql, params)
      .then(response => {
        const row_to_json = response.rows
        const transactions = [];
        row_to_json.map(item => {
          transactions.push(item['row_to_json'])
        })
        res.status(200).send(transactions);
      })
      .catch(err => next(err))
  })

// update category

app.put('/api/budgetbuddy/category', (req, res, next) => {
  const {transactionId, category} = req.body
  if (!category) {
    throw new ClientError(400, ' required');
  }
  const sql = `
    update "transactions"
    set "category" = $1
    where "transactionId" = $2
    returning *
  `
  const params = [category, transactionId];
  db.query(sql, params)
    .then(response => {
      const category = response.rows;
      res.status(200).send(category);
    })
    .catch(err => next(err))
})

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
