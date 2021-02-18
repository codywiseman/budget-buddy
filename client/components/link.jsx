import React from 'react';
import { PlaidLink } from 'react-plaid-link'
import AppContext from '../lib/app-context';

export default class Link extends React.Component {
  constructor(props) {
    super(props)
    this.state = {token: null}
    this.saveAccessToken = this.saveAccessToken.bind(this)
    this.createLinkToken = this.createLinkToken.bind(this)
  }
  saveAccessToken(token) {
    fetch('/api/save-token', {
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
    fetch('/api/create-link-token', {
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
            token={this.state.token}
            onEvent={(eventName) => {
              if(eventName === 'HANDOFF') {
                window.location.reload(true);
              }
            }}
            onSuccess={(public_token) => {
              fetch('/api/set-access-token', {
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
