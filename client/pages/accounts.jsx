import React from 'react';
import PlainLink, { PlaidLink } from 'react-plaid-link'

class Accounts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      linkToken: ''
    }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    fetch('/api/create_link_token', {
      method: 'POST'
    })
      .then(response => (response.json()))
      .then(token => this.setState({linkToken: token.link_token}))
  }
  render() {
    if(this.state.linkToken === '') {
      return (
        <button onClick={this.handleClick}>Click</button>
      )
    } else {
        return (
        <div>
          <PlaidLink
            token={this.state.linkToken}
            onSuccess={(public_token, metadata) => {

            }}>
            Connect a bank account
          </PlaidLink>
        </div>
      )
    }
  }
}

export default Accounts;
