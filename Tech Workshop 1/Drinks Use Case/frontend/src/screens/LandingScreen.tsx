import React, {useEffect, useState} from 'react';
import './LandingScreen.css'
import {useNavigate} from "react-router-dom";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const queryString = window.location.search;
    console.log("queryString", queryString)
    if (queryString.includes("code")) {
      console.log("Code found in query string");
      setIsLoggedIn(true)
      //handleNavigationVoting()
    }else {
      setIsLoggedIn(false)
    }
  }, []);

  const navigate = useNavigate()

  const handleNavigationLogin = () => {
      navigate('/login')
  }
  const handleNavigationVoting = () => {
    navigate('/voting')
  }
  const handleNavigationRegister = () => {
    navigate('/register')
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
        <img src="https://via.placeholder.com/500x500" alt="Placeholder" />
        <button onClick={() => handleNavigationLogin()}>Login</button>
        <button onClick={() => handleNavigationRegister()}>Register</button>

      </div>
    </div>
  );
};

export default App;
