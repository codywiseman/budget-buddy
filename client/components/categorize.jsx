import React from 'react';
import AppContext from '../lib/app-context';
import { parseMonth, parseYear } from '../lib/parseDate'

export default class Categorize extends React.Component {
  constructor(props) {
    super(props);
    this.state = { transactions: null }
    this.getTransactions = this.getTransactions.bind(this);
   // this.updateTransactions = this.updateTransactions.bind(this);
  }
  componentDidMount() {
   this.getTransactions();
  }
  getTransactions() {
    fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ accessToken: this.context.accessToken })
    })
    .then(response => response.json())
    .then(transactions => {
      transactions.map(item => {
        if(!item.category.includes('Deposit')) {
          this.updateTransactions(item);
        }
      })
    })
    .catch(err => console.log('ERROR'))
  }
  updateTransactions(transactionData) {
    fetch('/api/budgetbuddy/save_transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transactionId: transactionData.transaction_id,
        userId: this.context.userId,
        name: transactionData.name,
        month: parseMonth(transactionData.date),
        year: parseYear(transactionData.date),
        date: transactionData.date,
        amount: transactionData.amount
      })
    })
    .then(response => response.json())
    .then (transaction => transaction)
    .catch(err => console.log('ERROR'))
  }
  render() {
    return (
      <>
      </>
    )
  }
}

Categorize.contextType = AppContext;
