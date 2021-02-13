import React from 'react';
import parseRoute from './lib/parse-route';
import AppContext from './lib/app-context';
import Home from './pages/home';
import Accounts from './pages/accounts';
import Transactions from './pages/transactions';
import AuthPage from './pages/authPage';
import getAccessToken from './lib/get-access';
import BankLink from './pages/bankLink';
import Redirect from './components/redirect';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      userId: null,
      route: parseRoute(window.location.hash),
      accessToken: null
    };
    this.renderPage = this.renderPage.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      })
    })
    const user = window.localStorage.getItem('email');
    if(user) {
      fetch(`/api/budgetbuddy/user-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: user})
      })
        .then(res => res.json())
        .then(result => {
          const userId = result[0].userId;
          const accessToken = result[0].accessToken;
          this.setState({ user, userId, accessToken })
        })
        .catch(err => console.log('ERROR'))
    }
  }
  handleSignIn(result) {
    const { email, userId, accessToken } = result;
    window.localStorage.setItem('email', email);
    this.setState({
      user: email,
      userId: userId,
      accessToken: accessToken
    });
  }

  renderPage() {
    const { path } = this.state.route;
    if (path === '') {
      return <Home />;
    }
    if (path === 'login' || path === 'signup') {
      return <AuthPage />;
    }
    if (path === 'accounts') {
      return <Accounts />;
    }
    if (path === 'transactions') {
      return <Transactions />;
    }
    if (path === 'link') {
       return <BankLink />
    }
  }

  render() {
    console.log(this.state)
    const { user, route, accessToken, userId, } = this.state;
    const { handleSignIn } = this;
    const contextValue = { user, route, accessToken, userId, handleSignIn };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          {this.renderPage()}
        </>
      </AppContext.Provider>
    );
  }
}
