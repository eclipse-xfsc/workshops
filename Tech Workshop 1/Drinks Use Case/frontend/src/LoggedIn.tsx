import React from 'react';
import { useAuth } from 'oidc-react';

const LoggedIn = () => {
  const auth = useAuth();

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
          <strong>Not logged in!</strong>
          <br />
          <button onClick={() => auth.signIn()}>Log in!</button>
        </div>
      )}
    </>
  );
};

export default LoggedIn;
