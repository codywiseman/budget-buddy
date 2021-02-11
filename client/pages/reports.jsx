import React from 'react';
import Navbar from '../components/nav';
import Redirect from '../components/redirect';

class Reports extends React.Component {
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
      </>
    )
  }
}

export default Reports;
