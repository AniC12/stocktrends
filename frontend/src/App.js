import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Navigation from "./components/routes-nav/Navigation";
import MyRoutes from "./components/routes-nav/Routs";
import StocktrendsApi from "./api/api";
import UserContext from "./components/auth/UserContext";

export const TOKEN_STORAGE_ID = "stocktrends-token";

function App() {
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    StocktrendsApi.token = token;
    async function getCurrentUser() {
      if (token) {
        try {
          const user = await StocktrendsApi.getCurrentUser();
          setCurrentUser(user);
        } catch (error) {
          console.error("App got error on getting user:", error);
          setCurrentUser(null);
        }
      }
    }
    getCurrentUser();
  }, [token]);

  async function signup(signupData) {
    try {
      let token = await StocktrendsApi.signup(signupData);
      setToken(token);
      // Optionally fetch user info here if not included in signup response
      return { success: true };
    } catch (errors) {
      console.error("Signup failed:", errors);
      return { success: false, errors };
    }
  }

  async function login(loginData) {
    try {
      let token = await StocktrendsApi.login(loginData);
      setToken(token);
      // Optionally fetch user info here if not included in login response
      return { success: true };
    } catch (errors) {
      console.error("Login failed:", errors);
      return { success: false, errors };
    }
  }

  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  return (
    <BrowserRouter>
      <UserContext.Provider
        value={{ currentUser, setCurrentUser }}>
        <div className="App">
          <Navigation initialUser={currentUser} logout={logout} />
          <MyRoutes login={login} signup={signup} />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
