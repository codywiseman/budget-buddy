import React from 'react';
import Navbar from '../components/nav';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import Calculator from '../components/calculator'

export default class Home extends React.Component {
  render() {
    if (!this.context.user) {
      console.log('redirect')
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

Home.contextType = AppContext;
