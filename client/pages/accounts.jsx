import React from 'react';
import Navbar from '../components/nav';

class Accounts extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
      return (
      <>
        <Navbar />
        <h1>Accounts</h1>
      </>
    )
  }
}

export default Accounts;
