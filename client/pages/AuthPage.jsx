import React from 'react';
import Auth from '../components/auth';
import AppContext from '../lib/app-context'

export default class AuthPage extends React.Component {
  render() {
    return (
      <div>
        <div className="navbar navbar-expand-lg navbar-dark bg-success">
          <a className="navbar-brand" href="#"><i className="fas fa-piggy-bank mr-2"></i>BudgetBuddy</a>
        </div>
        <div className="container mt-5">
          <h4 className="text-center">Welcome to BudgetBuddy!</h4>
          <Auth action={this.context.route}/>
        </div>
      </div>
    );
  }
}

AuthPage.contextType = AppContext;
