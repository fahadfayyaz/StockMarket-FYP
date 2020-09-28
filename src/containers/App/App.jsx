import React, { Component, Fragment } from 'react';
import { connect, Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import * as firebase from 'firebase/app';
import 'firebase/auth';
// eslint-disable-next-line import/no-extraneous-dependencies
import { hot } from 'react-hot-loader';
import 'bootstrap/dist/css/bootstrap.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import '../../scss/app.scss';
import PropTypes from 'prop-types';
import Router from './Router';
import store from './store';
import ScrollToTop from './ScrollToTop';
import { config as i18nextConfig } from '../../translations';
import firebaseConfig from '../../config/firebase';
import Auth0Provider from '../../shared/components/auth/withAuth0';
import Loading from '../../shared/components/Loading';
import auth0Config from '../../config/auth0';

i18next.init(i18nextConfig);

const ThemeComponent = ({ children, themeName }) => {
  const theme = createMuiTheme({
    palette: {
      type: themeName === 'theme-dark' ? 'dark' : 'light',
    },
  });
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};

ThemeComponent.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  themeName: PropTypes.string.isRequired,
};

const ConnectedThemeComponent = connect(state => ({ themeName: state.theme.className }))(ThemeComponent);

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      loaded: false,
    };
  }

  componentDidMount() {
    window.addEventListener('load', () => {
      this.setState({ loading: false });
      setTimeout(() => this.setState({ loaded: true }), 500);
    });
    firebase.initializeApp(firebaseConfig);
  }

  onRedirectCallbackAuth0 = (appState) => {
    window.history.replaceState(
      {},
      document.title,
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname,
    );
  }

  render() {
    const { loaded, loading } = this.state;
    return (
      <Provider store={store}>
        <Auth0Provider
          domain={auth0Config.domain}
          client_id={auth0Config.clientId}
          redirect_uri={`${window.location.origin}/easydev/dashboard_default`}
          returnTo={`${window.location.origin}/easydev/dashboard_default`}
          onRedirectCallback={this.onRedirectCallbackAuth0}
        >
          <BrowserRouter basename="/easydev">
            <I18nextProvider i18n={i18next}>
              <ScrollToTop>
                <Fragment>
                  {!loaded
                      && (
                        <Loading loading={loading} />
                      )
                    }
                  <ConnectedThemeComponent>
                    <div>
                      <Router />
                    </div>
                  </ConnectedThemeComponent>
                </Fragment>
              </ScrollToTop>
            </I18nextProvider>
          </BrowserRouter>
        </Auth0Provider>
      </Provider>
    );
  }
}

export default hot(module)(App);
