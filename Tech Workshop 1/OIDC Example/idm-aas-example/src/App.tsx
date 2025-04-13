import React from 'react';
import { AuthProvider } from 'oidc-react';
import logo from './logo.svg';
import './App.css';
import LoggedIn from './LoggedIn';

const oidcConfig = {
  onSignIn: async (user: any) => {
    console.log(user);
    window.location.hash = '';
  },
  authority: 'https://aas-integration.gxfs.dev',
  clientId: 'gxfs-portal',
  responseType: 'code',
  scope: 'profile openid email',
  redirectUri: 'http://127.0.0.1:3000/',
};

function App() {
  return (
    <AuthProvider loadUserInfo={false} {...oidcConfig}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>OIDC React</p>
          <LoggedIn />
        </header>
      </div>
    </AuthProvider>
  );
}

export default App;
