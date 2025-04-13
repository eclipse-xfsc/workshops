import React, { useEffect, useState } from 'react';
import LoggedIn from './AuthenticationHandler';

import { AuthProvider } from 'oidc-react';


import {useNavigate} from "react-router-dom";

  function App() {
    const navigate = useNavigate()

    const handleNavigationBarkeep = () => {
      navigate('/barkeep-registration')
    }
    const handleNavigationVoter = () => {
      navigate('/voter-registration"')
    }
    return (
      <div className="container">
      <div className="left">
        <div className="centered">
          <h1>Welcome to</h1>
          <p>Drinks Inc.</p>
          <p></p>
        </div>
      </div>
      <div className="right">
        <button onClick={() => handleNavigationBarkeep()}>Barkeep</button>
        <button onClick={() => handleNavigationVoter()}>Voter</button>

      </div>
    </div>
    );
  }



export default App;
