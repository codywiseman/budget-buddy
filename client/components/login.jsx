import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }
  render() {
    return(
      <>
        <form className="mt-4">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" className="form-control" placeholder="Enter email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control"  placeholder="Password" />
          </div>
          <button type="submit" className="btn btn-success btn-block mt-4">Submit</button>
        </form>
        <small className="mt-3 text-center d-block">Don&apos;t have an account? <a href="#signup">Sign up</a></small>
      </>
    )
  }
}

export default Login;


/*
 return (

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
          <small className="mt-3 text-center d-block">Have an account? <a href="#login">Sign in</a></small>
    );
*/
