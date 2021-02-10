import React from 'react';
import Navbar from '../components/nav';
import Calculator from '../components/calculator';

class Budgets extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <>
        <Navbar />
        <Calculator />
      </>
    )
  }
}

export default Budgets;
