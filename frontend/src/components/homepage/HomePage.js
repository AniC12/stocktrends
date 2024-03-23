import React from "react";
import { Link } from "react-router-dom";
//import UserContext from "../auth/UserContext";

/** Homepage of site.
 *
 * Shows welcome message, information about stocktrends, list of strategies
 *
 * Routed at /
 *
 * Routes -> Homepage
 */

function Homepage() {
    //const { currentUser } = useContext(UserContext);

    return (
        <div className="Homepage">
            <div className="container text-center">
                <h1 className="mb-4 font-weight-bold">Welcome to Stocktrends</h1>
                <p className="lead">Text about Stocktrends</p>
                <Link className="btn btn-primary font-weight-bold mr-3"
                    to="/strategies">
                    Strategies
                </Link>
            </div>
        </div>
    );
}

export default Homepage;