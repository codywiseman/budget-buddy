import React from 'react';
import Login from '../components/login';

class AuthPage extends React.Component {
  render() {
    return (
      <div>
        <div className="navbar navbar-expand-lg navbar-dark bg-success">
          <a className="navbar-brand" href="#"><i className="fas fa-piggy-bank mr-2"></i>BudgetBuddy</a>
        </div>
        <div className="container mt-5">
          <h4 className="text-center">Welcome to BudgetBuddy!</h4>
          <p className="text-center"> Lets start by getting logged in to your BudgetBuddy Account.</p>
          <Login />
        </div>
      </div>
    );
  }
}

export default  AuthPage;
