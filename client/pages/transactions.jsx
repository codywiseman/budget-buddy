import React from 'react';
import Navbar from '../components/nav';
import Categorize from '../components/categorize';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';


export default class Transactions extends React.Component {
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
          <Categorize />
        </>
      )
    }
  }
}

Transactions.contextType = AppContext;
