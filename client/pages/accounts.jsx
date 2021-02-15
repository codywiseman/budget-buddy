import React from 'react';
import Navbar from '../components/nav';
import AppContext from '../lib/app-context';
import Balance from '../components/balance';
import Redirect from '../components/redirect';

export default class Accounts extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    if (!this.context.user) {
      return <Redirect to="login" />
    }
    else {
      return (
        <>
          <Navbar />
          <Balance />
        </>
      )
    }
  }
}

Accounts.contextType = AppContext;
