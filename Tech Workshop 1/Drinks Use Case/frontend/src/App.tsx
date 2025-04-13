import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from './screens/LoginScreen';
import Landing from './screens/LandingScreen';
import Voting from './screens/VotingScreen';
import Retrieve from './screens/RetrieveScreen';
import Results from './screens/ResultsScreen';
import Register from './screens/RegisterScreen'
import BarkeepRegiter from './screens/BarkeepRegisterScreen'
import VoterRegiter from './screens/VoterRegisterScreen'

const App: React.FC = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route
            path="*"
            element={
                <Landing/>
            }
        />
        <Route
            path="/register"
            element={
                <Register/>
            }
        />
        <Route
            path="/landing"
            element={
                <Landing/>
            }
        />
        <Route
            path="/login"
            element={
                <Login/>
            }
        />
        <Route
            path="/voting"
            element={
                <Voting/>
            }
        />
        <Route
            path="/retrieve"
            element={
                <Retrieve/>
            }
        />
        <Route
            path="/results"
            element={
                <Results/>
            }
        />
        <Route
            path="/barkeep-registration"
            element={
                <BarkeepRegiter/>
            }
        />
        <Route
            path="/voter-registration"
            element={
                <VoterRegiter/>
            }
        />
        <Route
            path="/token/"
            element={
                <Login/>
            }
        />
    </Routes>
    </BrowserRouter>
  );
};

export default App;