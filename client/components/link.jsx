import React from 'react';
import PlainLink, { PlaidLink } from 'react-plaid-link'
import Accounts from '../pages/accounts';
import AppContext from '../lib/app-context';
import Redirect from './redirect';

export default class Link extends React.Component {
  constructor(props) {
    super(props)
    this.state = {token: null}
    this.saveAccessToken = this.saveAccessToken.bind(this)
    this.createLinkToken = this.createLinkToken.bind(this)
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
    .catch(err => console.log('ERROR'))
  }
  createLinkToken() {
    fetch('/api/create_link_token', {
      method: 'POST'
    })
      .then(response => (response.json()))
      .then(token => this.setState({ token: token.link_token}))
      .catch(err => console.log('ERROR'))
  }

  render() {
    if(this.state.token === null) {
      this.createLinkToken()
      return (
        <>
        </>
      )
    } else {
      return (
        <div className="text-center">
          <PlaidLink
            onEvent={(eventName) => {
              if(eventName === 'HANDOFF') {
                window.location.reload(true);
              }
            }}
            token={this.state.token}
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
                  this.saveAccessToken(accessToken.access_token);
                })
                .catch(err => console.log('ERROR'))
            }}>
            Connect a bank account
        </PlaidLink>
        </div>
      )
    }
  }
}


Link.contextType = AppContext;
