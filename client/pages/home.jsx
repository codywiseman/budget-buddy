import React from 'react';
import Navbar from '../components/nav';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context'

export default class Home extends React.Component {
  render() {
    if (!this.context.user) {
      return <Redirect to="login" />
    }
    console.log(this)
    return (
      <>
        <Navbar />
      </>
    )
  }
}

Home.contextType = AppContext;
