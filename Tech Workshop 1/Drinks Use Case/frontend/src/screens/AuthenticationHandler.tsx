import React from 'react';
import { useAuth } from 'oidc-react';
import './AuthenticationHandler.css'

const LoggedIn = () => {
  const auth = useAuth();
  console.log("auth ", auth)
  return (
    <>
      {auth && auth.userData ? (
        <div>
          <strong>Logged in! 🎉</strong>
          <br />
          <button onClick={() => auth.signOut()}>Log out!</button>
        </div>
      ) : (
        <div>
          <strong>Please authenticate yourself! </strong>
          <br />
          <button onClick={() => auth.signIn()}>Log in!</button>
        </div>
      )}
    </>
  );
};

export default LoggedIn;
