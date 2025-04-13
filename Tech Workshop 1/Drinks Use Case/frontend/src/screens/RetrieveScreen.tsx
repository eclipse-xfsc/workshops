import React from 'react';
import './RetrieveScreen.css'

import {useNavigate} from "react-router-dom";


const App: React.FC = () => {
  const navigate = useNavigate()

  const handleNavigation = () => {
    navigate('/results')
  }
  return (
    <div className="container">
      <div className="left">
        <div className="centered">
          <h1>Welcome to</h1>
          <p>Drinks Inc.</p>
          <p>RetrieveScreen.tsx</p>
        </div>
      </div>
      <div className="right">
        <img src="https://via.placeholder.com/500x500" alt="Placeholder" />
        <button onClick={() => handleNavigation()}>Results</button>
      </div>
    </div>
  );
};

export default App;
