import React from 'react';
import parseRoute from './lib/parse-route';
import AppContext from './lib/app-context';
import Home from './pages/home';
import Accounts from './pages/accounts';
import Budgets from './pages/budgets';
import Transactions from './pages/transactions';
import Reports from './pages/reports';
import AuthPage from './pages/AuthPage';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      route: parseRoute(window.location.hash)
    }
  this.renderPage = this.renderPage.bind(this);
  }
  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      })
    })
  }
  renderPage() {
    const { path } = this.state.route
    if(path === '') {
      return <Home />
    }
    if (path === 'login' || path === 'sign-up') {
      return <Auth />;
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
    const { user, route } = this.state;
    const { handleSignIn } = this;
    const contextValue = { user, route, handleSignIn};
    if(!user) {
      return (
        <AuthPage />
      )
    } else {
      return (
        <AppContext.Provider value={contextValue}>
          <>
            {this.renderPage()}
          </>
        </AppContext.Provider>
      )
    }
  }
}
