import React, { useState, useEffect } from 'react';
import Navigation from './components/routes-nav/Navigation';
import Homepage from './components/homepage/HomePage';
import MyRoutes from './components/routes-nav/Routs';
import { BrowserRouter } from "react-router-dom";
import StocktrendsApi from './api/api';
import useLocalStorage from './hooks/useLocalStorage';

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "my-token";

function App() {

  //const [infoLoaded, setInfoLoaded] = useState(false);
  //const [applicationIds, setApplicationIds] = useState(new Set([]));
  //const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  /* useEffect(function loadUserInfo() {

    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwt.decode(token);
          // put the token on the Api class so it can use it to call the API.
          StocktrendsApi.token = token;
          let currentUser = await StocktrendsApi.getCurrentUser(username);
          setCurrentUser(currentUser);
          setApplicationIds(new Set(currentUser.applications));
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }

    // set infoLoaded to false while async getCurrentUser runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to false to control the spinner.
    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  /** Handles site-wide logout. */
  /*function logout() {
    setCurrentUser(null);
    setToken(null);
  } */

  async function signup(signupData) {
    try {
      let token = await StocktrendsApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  async function login(loginData) {
    try {
      let token = await StocktrendsApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Navigation />
        <MyRoutes login={login} signup={signup}/>
      </div>
    </BrowserRouter>
  );
}

export default App;
