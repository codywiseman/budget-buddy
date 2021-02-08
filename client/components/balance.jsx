import React from 'react';
import AppContext from '../lib/app-context'
import toDollar from '../lib/toDollar'

export default class Balance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {accounts: []}
    this.getBalance = this.getBalance.bind(this);
    this.updateAccounts = this.updateAccounts.bind(this);
  }
  componentDidMount() {
    fetch('/api/budgetbuddy/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userId: this.context.userId,})
    })
    .then(response => response.json())
    .then(account => this.setState({accounts: account}))
    .catch(err => console.log(err))
  }
  updateAccounts(account) {
     fetch('/api/budgetbuddy/update_account_balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plaidId: account.account_id,
          userId: this.context.userId ,
          name: account.name ,
          subtype: account.subtype ,
          balances: account.balances.current
        })
      })
      .catch(err => console.log('ERROR'))
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
    .then(account => {
      const accountArray = account.accounts;
      accountArray.forEach(account => this.updateAccounts(account));
      window.location.reload(true);
    })
    .catch(err => console.log('ERROR'))
  }
  render() {
    const accountsArray = [...this.state.accounts];
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
              <tr key={account.account_id}>
                <td>{account.name}</td>
                <td>{account.subtype}</td>
                <td>{toDollar(account.balances)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-center mb-2">
          <button onClick={this.getBalance} className="btn btn-success">Refresh Account Balance</button>
        </div>
      </>
    )
  }
}

Balance.contextType = AppContext;
