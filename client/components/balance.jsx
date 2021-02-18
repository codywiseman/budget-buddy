import React from 'react';
import AppContext from '../lib/app-context'
import toDollar from '../lib/to-dollar'

export default class Balance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {accounts: []}
    this.getAccounts = this.getAccounts.bind(this);
    this.updateAccounts = this.updateAccounts.bind(this);
    this.renderAccounts = this.renderAccounts.bind(this);
  }
  componentDidMount() {
    this.getAccounts()
  }
  renderAccounts() {
    fetch('/api/import-accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: this.context.userId, })
    })
      .then(response => response.json())
      .then(account => this.setState({ accounts: account }))
      .catch(err => console.log('ERROR'))
  }
  updateAccounts(account) {
     fetch('/api/update-account-balance', {
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
      .then(this.renderAccounts())
      .catch(err => console.log('ERROR'))
    }
  getAccounts() {
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
    })
    .catch(err => console.log('ERROR'))
  }
  render() {
    const accountsArray = [...this.state.accounts];
    return (
      <>
        <table className="table table-striped">
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
      </>
    )
  }
}

Balance.contextType = AppContext;
