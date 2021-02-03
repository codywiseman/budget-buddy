require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const plaid = require('plaid');
const util = require('util');
const bodyParser = require('body-parser');
const moment = require('moment');

const APP_PORT = process.env.APP_PORT || 3000;
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || 'transactions').split(',');
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split( ',');

let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;

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
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(bodyParser.json());

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

// Exchange token flow - exchange a Link public_token for
// an API access_token
// https://plaid.com/docs/#exchange-token-flow
app.post('/api/set_access_token', function (request, response, next) {
  PUBLIC_TOKEN = request.body.public_token;
  client.exchangePublicToken(PUBLIC_TOKEN, function (error, tokenResponse) {
    if (error != null) {
      return response.json({
        error,
      });
    }
    ACCESS_TOKEN = tokenResponse.access_token;
    ITEM_ID = tokenResponse.item_id;
    response.json({
      access_token: ACCESS_TOKEN,
      item_id: ITEM_ID,
      error: null,
    });
  });
});

// Retrieve an Item's accounts
// https://plaid.com/docs/#accounts
app.get('/api/accounts', function (request, response, next) {
  client.getAccounts(ACCESS_TOKEN, function (error, accountsResponse) {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    prettyPrintResponse(accountsResponse);
    response.json(accountsResponse);
  });
});

// Retrieve Transactions for an Item
// https://plaid.com/docs/#transactions
app.get('/api/transactions', function (request, response, next) {
  // Pull transactions for the Item for the last 30 days
  const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');
  client.getTransactions(
    ACCESS_TOKEN,
    startDate,
    endDate,
    {
      count: 250,
      offset: 0,
    },
    function (error, transactionsResponse) {
      if (error != null) {
        prettyPrintResponse(error);
        return response.json({
          error,
        });
      } else {
        response.json(transactionsResponse);
      }
    },
  );
});

// Retrieve real-time Balances for each of an Item's accounts
// https://plaid.com/docs/#balance
app.get('/api/balance', function (request, response, next) {
  client.getBalance(ACCESS_TOKEN, function (error, balanceResponse) {
    if (error != null) {
      return response.json({
        error,
      });
    }
    response.json(balanceResponse);
  });
});

app.use(errorMiddleware);


app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
