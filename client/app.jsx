import React from 'react';
import parseRoute from './lib/parse-route';
import AppContext from './lib/app-context';
import Home from './pages/home';
import Accounts from './pages/accounts';
import Budgets from './pages/budgets';
import Transactions from './pages/transactions';
import Reports from './pages/reports';
import AuthPage from './pages/authPage';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      route: parseRoute(window.location.hash),
      linkToken: null,
      accessToken: null
    }
  this.renderPage = this.renderPage.bind(this);
  this.handleSignIn = this.handleSignIn.bind(this);
  this.handleLinkToken = this.handleLinkToken.bind(this);
  this.handleAccessToken = this.handleAccessToken.bind(this);
  }
  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      })
    })
    const user = window.localStorage.getItem('email');
    const accessToken = window.localStorage.getItem('accessToken')
    this.setState({ user, accessToken });

  }
  handleSignIn(result) {
    const { email } = result;
    window.localStorage.setItem('email', email);
    this.setState({ user: email });
  }
  handleLinkToken(token) {
    this.setState({linkToken: token})
  }
  handleAccessToken(token) {
    this.setState({ accessToken: token })
    window.localStorage.setItem('accessToken', token)
  }
  renderPage() {
    const { path } = this.state.route
    if(path === '') {
      return <Home />
    }
    if (path === 'login' || path === 'signup') {
      return <AuthPage />;
    }
    if (path === 'accounts') {
      return <Accounts />
    }
    if (path === 'budget') {
      return <Budgets />
    }
    if (path === 'transactions') {
      return <Transactions />
    }
    if (path === 'reports') {
      return <Reports />
    }
  }
  render() {
    const { user, route, linkToken, accessToken } = this.state;
    const { handleSignIn, handleLinkToken, handleAccessToken } = this;
    const contextValue = { user, route, linkToken, accessToken, handleSignIn, handleLinkToken, handleAccessToken };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          {this.renderPage()}
        </>
      </AppContext.Provider>
    )
  }
}
