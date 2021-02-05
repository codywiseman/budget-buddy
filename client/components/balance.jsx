import React from 'react';
import AppContext from '../lib/app-context'

export default class Balance extends React.Component {
  constructor(props) {
    super(props);
    this.getBalance = this.getBalance.bind(this);
  }
  getBalance() {
    fetch('/api/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({accessToken: this.context.accessToken})
    })
    .then(response => response.json())
    .then(account => console.log(account.accounts))
    .catch(err => console.log('ERROR'))
  }
  render() {
    return <button onClick={this.getBalance}>Get Balance</button>
  }
}

Balance.contextType = AppContext;
