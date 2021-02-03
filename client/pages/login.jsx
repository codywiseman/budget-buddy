import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange() {
  }
  render() {
    return (
      <div>
        <div className="navbar navbar-expand-lg navbar-dark bg-success">
          <a className="navbar-brand" href="#"><i className="fas fa-piggy-bank mr-2"></i>BudgetBuddy</a>
        </div>
        <div className="container mt-5">
          <h4 className="text-center">Welcome to BudgetBuddy!</h4>
          <p className="text-center"> Lets start by getting logged in to your BudgetBuddy Account.</p>
          <form className="mt-4">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input type="email" className="form-control" id="email" placeholder="Enter email" value={this.state.email} onChange={this.handleChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" placeholder="Password" value={this.state.password} onChange={this.handleChange}/>
            </div>
            <button type="submit" className="btn btn-success btn-block mt-4">Submit</button>
          </form>
          <small className="mt-3 text-center d-block">Don&apos;t have an account? <a href="#">Sign up</a></small>
        </div>
      </div>
    );
  }
}

export default Login;
