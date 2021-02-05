import React from 'react';
import Navbar from '../components/nav';
import Link from '../components/link';
import AppContext from '../lib/app-context';

export default class Accounts extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    if(!this.context.accessToken) {
      return (
        <>
          <Navbar />
          <Link />
        </>
      )
    } else {
      return (
        <Navbar />
      )
    }
  }
}

Accounts.contextType = AppContext;
