import React from 'react';
import Navbar from '../components/nav';
import Calculator from '../components/calculator';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class Budgets extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    if (!this.context.user) {
      return <Redirect to="login" />
    }
    return (
      <>
        <Navbar />
        <Calculator />
      </>
    )
  }
}

Budgets.contextType = AppContext;
