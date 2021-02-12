import React from 'react';
import Navbar from '../components/nav';
import Categorize from '../components/categorize';
import Link from '../components/link';
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
    if (!this.context.accessToken) {
      return (
        <>
          <Navbar />
          <Link />
        </>
      )
    } else {
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
