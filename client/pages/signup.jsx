import React from 'react';

class Signup extends React.Component {
  render() {
    return (
      <div>
        <div className="navbar navbar-expand-lg navbar-dark bg-success">
          <a className="navbar-brand" href="#"><i className="fas fa-piggy-bank mr-2"></i>BudgetBuddy</a>
        </div>
        <div className="container mt-4">
          <h4 className="text-center">Welcome to BudgetBuddy!</h4>
          <p className="text-center"> Lets get you signed up to a BudgetBuddy Account.</p>
          <form>
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input type="text" class="form-control" placeholder="First Name" />
            </div>
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input type="text" class="form-control" placeholder="Last Name" />
            </div>
            <div class="form-group">
              <label for="email">Email address</label>
              <input type="email" class="form-control"  placeholder="Enter email" />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" class="form-control" placeholder="Password" />
            </div>
            <button type="submit" class="btn btn-success btn-block mt-4">Submit</button>
          </form>
          <small className="mt-3 text-center d-block">Have an account? <a href="#">Sign in</a></small>
        </div>
      </div>
    );
  }
}

export default Signup;
