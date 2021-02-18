import React from 'react';
import AppContext from '../lib/app-context';

export default class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'bb@gmail.com',
      password: 'BudgetBuddy!'
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.verifyLogin = this.verifyLogin.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.verifyLogin();
  }
  handleChange() {
    const { name, value } = event.target;
    this.setState({[name]: value})
  }
  verifyLogin() {
    fetch(`/api/${this.props.action.path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then(res => res.json())
    .then(result => {
      if (result[0].email) {
        this.props.onSignIn(result[0])
      }
    })
    .catch(err => console.log('ERROR'))
  }
  render() {
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
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-9 col-md-7">
            <p className="text-center">{message}</p>
            <form className="mt-4" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                type="email"
                name ="email"
                className="form-control"
                // placeholder="Enter email"
                value="bb@gmail.com"
                disabled
                onChange={this.handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                type="password"
                name="password"
                className="form-control"
                // placeholder="Password"
                value="BudgetBuddy!"
                disabled
                onChange={this.handleChange} />
              </div>
              <button
              type="submit"
              className="btn
              btn-success
              btn-block mt-4">
              Submit</button>
            </form>
            <small className="mt-3 text-center d-block">{account}
            <a href={link}>Click Here</a></small>
          </div>
        </div>
      </div>
    )
  }
}

Auth.contextType = AppContext;
