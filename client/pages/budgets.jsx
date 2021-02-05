import React from 'react';
import Navbar from '../components/nav';

class Budgets extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <>
        <Navbar />
        <h1>Budgets</h1>
      </>
    )
  }
}

export default Budgets;
