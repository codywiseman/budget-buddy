import React from 'react';
import AppContext from '../lib/app-context'
import toDollar from '../lib/toDollar'

export default class Balance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {accounts: []}
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
    .then(account => this.setState({accounts: account.accounts}))
    .catch(err => console.log('ERROR'))
  }
  render() {
    const accountsArray = [...this.state.accounts];
    console.log(accountsArray)
    return (
      <>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Account</th>
              <th scope="col">Type</th>
              <th scope="col">Balance</th>
            </tr>
          </thead>
          <tbody>
            {accountsArray.map(account => (
              <tr key={account.mask}>
                <td>{account.name}</td>
                <td>{account.subtype}</td>
                <td>{toDollar(account.balances.current)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-center mb-4">
          <button onClick={this.getBalance} className="btn btn-success">Refresh Account Balance</button>
        </div>
      </>
    )
  }
}

Balance.contextType = AppContext;
