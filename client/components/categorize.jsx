import React from 'react';
import AppContext from '../lib/app-context';
import toDollar from '../lib/toDollar'
import { parseMonth, parseYear } from '../lib/parseDate'

export default class Categorize extends React.Component {
  constructor(props) {
    super(props);
    this.state = { transactions: [] }
    this.getTransactions = this.getTransactions.bind(this);
    this.updateTransactions = this.updateTransactions.bind(this);
    this.importTransactions = this.importTransactions.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.importTransactions();
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
    .then(this.importTransactions())
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
  importTransactions() {
    fetch('api/budgetbuddy/export_transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userId: this.context.userId})
    })
    .then(response => response.json())
    .then(transactionData => this.setState({transactions: transactionData}))
    .catch(err => console.log('ERROR'))
  }
  handleChange() {

  }
  render() {
    if(this.state.transactions.length === 0) {
      return (
        <div className="text-center mb-2">
          <button onClick={this.getTransactions} className="btn btn-success">Refresh Transactions</button>
        </div>
      )
    } else {
      const transactions = [...this.state.transactions]
      return (
        <div className="container">
          <div className="row">
            {transactions.map(item =>
              <div key={item.transactionId} className="col-12 col-md-6 col-xs-12 mt-1">
                <div className="d-flex justify-content-between border rounded">
                  <div className="ml-3 mt-2 mb-2 col-7">
                    <p>{item.name}</p>
                    <select className="form-control" id={item.transaction_id} defaultValue="default" onChange={this.handleChange}>
                      <option value="default" disabled>Category</option>
                      <option>Food &amp; Drink</option>
                      <option>Travel</option>
                      <option>Entertainment</option>
                      <option>Personal</option>
                      <option>Healthcare</option>
                      <option>Education</option>
                      <option>Services</option>
                      <option>Misc.</option>
                    </select>
                  </div>
                  <div className="mr-3 mt-2 mb-2 col-5">
                    <p>{toDollar(item.amount)}</p>
                    <p>{item.date}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="text-center mb-2 mt-2">
            <button onClick={this.getTransactions} className="btn btn-success">Refresh Transactions</button>
          </div>
        </div>
      )
    }
  }
}

Categorize.contextType = AppContext;
