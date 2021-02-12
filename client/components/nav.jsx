import React from 'react';
import AppContext from '../lib/app-context';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <a className="navbar-brand" href="#"><i className="fas fa-piggy-bank mr-2"></i>BudgetBuddy</a>
        <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a className="nav-item nav-link" href="#">Home</a>
            <a className="nav-item nav-link" href="#budget">Budget</a>
            <a className="nav-item nav-link" href="#transactions">Transactions</a>
            <a className="nav-item nav-link" href="#accounts">Accounts</a>
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.contextType = AppContext;
