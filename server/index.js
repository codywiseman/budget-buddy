require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const plaid = require('plaid');
const util = require('util');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();
app.use(express.json());

app.use(staticMiddleware);

const accessToken = process.env.PLAID_ACCESS_TOKEN;

const client = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments.sandbox,
});

app.use(errorMiddleware);


app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
