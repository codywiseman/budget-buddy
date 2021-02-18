import React from 'react';
import parseRoute from './lib/parse-route';
import AppContext from './lib/app-context';
import Home from './pages/home';
import Accounts from './pages/accounts';
import Transactions from './pages/transactions';
import AuthPage from './pages/auth-page';
import getAccessToken from './lib/get-access';
import BankLink from './pages/bank-link';
import Redirect from './components/redirect';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      userId: null,
      route: parseRoute(window.location.hash),
      accessToken: null,
      isAuthorizing: true
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
    this.setState({ user })
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
          this.setState({ userId, accessToken, isAuthorizing: false})
        })
        .catch(err => console.log('ERROR'))
    } else if (!user) {
      this.setState({isAuthorizing: false})
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
    if (this.state.isAuthorizing) return null;
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
