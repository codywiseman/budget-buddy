import React from 'react';

class AuthPage extends React.Component {
  render() {
    const message = route.path === 'login'
    ? 'Lets start by getting logged in to your BudgetBuddy Account.'
      : 'Lets get you signed up to a BudgetBuddy Account.'
    return (
      <div>
        <div className="navbar navbar-expand-lg navbar-dark bg-success">
          <a className="navbar-brand" href="#"><i className="fas fa-piggy-bank mr-2"></i>BudgetBuddy</a>
        </div>
        <div className="container mt-5">
          <h4 className="text-center">Welcome to BudgetBuddy!</h4>
          <p className="text-center"> {message}</p>
          <form className="mt-4">
            <div class="form-group">
              <label for="email">Email address</label>
              <input type="email" class="form-control" placeholder="Enter email" />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" class="form-control"  placeholder="Password" />
            </div>
            <button type="submit" class="btn btn-success btn-block mt-4">Submit</button>
          </form>
          <small className="mt-3 text-center d-block">Don&apos;t have an account? <a href="#">Sign up</a></small>
        </div>
      </div>
    );
  }
}

AuthPage.contextType = AppContext;
export default AuthPage;
