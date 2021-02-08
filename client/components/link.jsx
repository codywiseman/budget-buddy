import React from 'react';
import PlainLink, { PlaidLink } from 'react-plaid-link'
import Accounts from '../pages/accounts';
import AppContext from '../lib/app-context';

export default class Link extends React.Component {
  constructor(props) {
    super(props)
    this.saveAccessToken = this.saveAccessToken.bind(this)
  }
  saveAccessToken(token) {
    fetch('/api/budgetbuddy/save_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
            },
      body: JSON.stringify({
        accessToken: token,
        email: this.context.user
      })
  })
    .then(response => (response.json()))
    .catch(err => console.log('ERROR'))
  }
  render() {
   return (
      <div className="text-center mt-2">
        <PlaidLink
          token={this.context.linkToken}
          onSuccess={(public_token) => {
            fetch('/api/set_access_token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ token: public_token })
            })
            .then(response => (response.json()))
            .then(accessToken => {
              window.localStorage.setItem('accessToken', accessToken.access_token);
              this.saveAccessToken(accessToken.access_token);
              window.location.reload(true);
            })
            .catch(err => console.log('ERROR'))
          }}>
          Connect a bank account
        </PlaidLink>
      </div>
    )
  }
}


Link.contextType = AppContext;
