import React from 'react';
import parseRoute from './lib/parse-route';
import AppContext from './lib/app-context';
import Home from './pages/home';
import Accounts from './pages/accounts';
import Budgets from './pages/budgets';
import Transactions from './pages/transactions';
import AuthPage from './pages/authPage';
import getAccessToken from './lib/get-access';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      userId: null,
      route: parseRoute(window.location.hash),
      linkToken: null,
      accessToken: null
    };
    this.renderPage = this.renderPage.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleLinkToken = this.handleLinkToken.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
    const user = window.localStorage.getItem('email');
    const userId = window.localStorage.getItem('userId');
    const accessToken = window.localStorage.getItem('accessToken');
    this.setState({ user, userId, accessToken });
  }

  handleSignIn(result) {
    const { email, userId } = result;
    const accessToken = getAccessToken(email);
    window.localStorage.setItem('email', email);
    window.localStorage.setItem('accessToken', accessToken);
    window.localStorage.setItem('userId', userId);
    this.setState({
      user: email,
      userId: userId,
      accessToken: accessToken
    });
  }

  handleLinkToken(token) {
    this.setState({ linkToken: token });
  }

  renderPage() {
    const { path } = this.state.route;
    if (path === '') {
      return <Home />;
    }
    if (path === 'login' || path === 'signup' || !this.state.user) {
      return <AuthPage />;
    }
    if (path === 'accounts') {
      return <Accounts />;
    }
    if (path === 'budget') {
      return <Budgets />;
    }
    if (path === 'transactions') {
      return <Transactions />;
    }
  }

  render() {
    const { user, route, linkToken, accessToken, userId } = this.state;
    const { handleSignIn, handleLinkToken } = this;
    const contextValue = { user, route, linkToken, accessToken, userId, handleSignIn, handleLinkToken };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          {this.renderPage()}
        </>
      </AppContext.Provider>
    );
  }
}
