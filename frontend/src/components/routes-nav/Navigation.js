import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navigation.css"
//import UserContext from "./auth/UserContext";

/** Navigation bar for site. Shows up on every page.
 *
 * Rendered by App.
 */

function Navigation({ logout }) {
  //const { currentUser } = useContext(UserContext);

  /* function loggedInNav() {
    return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item mr-4">
            <NavLink className="nav-link" to="/portfolios">
              My Portfolios
            </NavLink>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/" onClick={logout}>
              Log out
            </Link>
          </li>
        </ul>
    );
  } */

  function loggedOutNav() {
    return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item mr-4">
            <NavLink className="nav-link" to="/portfolios">
              My Portfolios
            </NavLink>
          </li>
          <li className="nav-item mr-4">
            <NavLink className="nav-link" to="/login">
              Login
            </NavLink>
          </li>
          <li className="nav-item mr-4">
            <NavLink className="nav-link" to="/signup">
              Sign Up
            </NavLink>
          </li>
        </ul>
    );
  }

  return (
      <nav className="Navigation navbar navbar-expand-md">
        <Link className="navbar-brand" to="/">
          Home
        </Link>
        {loggedOutNav()}
      </nav>
  );
}

//{currentUser ? loggedInNav() : loggedOutNav()}

export default Navigation;
