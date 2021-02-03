import React from 'react';
import Link from './link'

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
    return (
      <div>
        <button onClick={this.handleClick}>Connect to Bank Account</button>
      </div>
    )
  }
}

export default Accounts;
