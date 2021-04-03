import React from 'react';
import Link from '../components/link';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import pigGif from '../images/piggy.gif';

const styles = {
  color: '#27A745'
}

export default class BankLink extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (!this.context.user) {
      return <Redirect to="login" />
    }
    if (this.context.accessToken) {
      return <Redirect to="" />
    }
    return (
      <div>
        <div className="navbar navbar-dark bg-success mb-2">
          <a className="navbar-brand" href="#"><i className="fas fa-piggy-bank mr-2"></i>BudgetBuddy</a>
        </div>
        <div className="container mt-5 text-center">
          <h6 className="mt-4 mb-4">Having access to your bank transactions in BudgetBuddy makes keeping track of your budget a breeze!</h6>
          <div>
            <img src={pigGif} alt="Piggy Bank"/>
          </div>
          <div className="mt-4">
            <Link />
          </div>
        </div>
      </div>
    )
  }
}

BankLink.contextType = AppContext;
