import React from 'react';

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  //  this.handleChange = this.handleChange.bind(this);
  //  this.handleSubmit = this.handleSubmit.bind(this);
  }
  render() {
   // if(this.props.action.path ==='login') {
      const message = this.props.action.path === 'login'
        ? 'Lets get you logged in to your BudgetBuddy account.'
        : 'Start saving money by creating a BudgetBuddy account.'
      const account = this.props.action.path === 'login'
        ? 'Don\'t have an account?'
        : 'Have an account?'
      const link = this.props.action.path === 'login'
        ? '#signup'
        : '#login'
      return (
        <>
          <p className="text-center">{message}</p>
          <form className="mt-4">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input type="email" className="form-control" placeholder="Enter email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" placeholder="Password" />
            </div>
            <button type="submit" className="btn btn-success btn-block mt-4">Submit</button>
          </form>
          <small className="mt-3 text-center d-block">{account} <a href={link}>Sign up</a></small>
        </>
      )
  /* } else if (this.props.action.path === 'signup') {
      return (
        <>
          <p className="text-center">Start saving money by creating a BudgetBuddy Account.</p>
          <form className="mt-4">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input type="email" className="form-control"  placeholder="Enter email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" placeholder="Password" />
            </div>
            <button type="submit" className="btn btn-success btn-block mt-4">Submit</button>
          </form>
          <small className="mt-3 text-center d-block">Have an account? <a href="#login">Sign in</a></small>
        </>
      )
    } */
  }
}

export default Auth;
