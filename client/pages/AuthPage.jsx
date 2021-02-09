import React from 'react';
import Auth from '../components/auth';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';

export default class AuthPage extends React.Component {
  render() {
    const { user, route, handleSignIn } = this.context;

    if (user) return <Redirect to="" />;
    return (
      <>
        <div className="navbar navbar-dark bg-success">
          <a className="navbar-brand" href="#"><i className="fas fa-piggy-bank mr-2"></i>BudgetBuddy</a>
        </div>
        <div className="container mt-5">
          <h4 className="text-center">Welcome to BudgetBuddy!</h4>
          <Auth
          action={this.context.route}
          onSignIn={this.context.handleSignIn} />
        </div>
      </>
    );
  }
}

AuthPage.contextType = AppContext;
