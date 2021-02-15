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
    .then(this.importTransactions())
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
    .then(transactionData => this.setState({ transactions: transactionData }))
    .catch(err => console.log('ERROR'))
  }
  handleChange() {
    const transactionId = event.target.closest('select').id;
    const category = event.target.value;
    fetch('/api/budgetbuddy/category', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({transactionId, category})
    })
    .then(response => response.json())
    .then(category => {
      const transactions = [...this.state.transactions];
      const index = transactions.findIndex(x => x.transactionId === transactionId);
      transactions[index] = category[0];
      this.setState({transactions})
    })
    .catch(err => console.log('ERROR'))
  }
  render() {
    const transactions = [...this.state.transactions]
    return (
      <div className="container mb-2">
        <div className="row">
          {transactions.map(item =>
            <div key={item.transactionId} className="col-12 col-md-6 col-xs-12 mt-1">
              <div className="d-flex justify-content-between border rounded">
                <div className="ml-3 mt-2 mb-2 col-7">
                  <p>{item.name}</p>
                  <select className="form-control"
                  id={item.transactionId}
                  value={item.category === null ? 'default': item.category}
                  onChange={this.handleChange}>
                    <option value="default" disabled>Category</option>
                    <option value="food">Food &amp; Drink</option>
                    <option value="travel">Travel</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="personal">Personal</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="services">Services</option>
                    <option value="misc">Misc.</option>
                    <option value="notIncl">Not Included in Budget</option>
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
      </div>
    )
  }
}

Categorize.contextType = AppContext;
