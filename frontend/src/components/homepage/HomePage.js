import React from "react";
import { Link } from "react-router-dom";
import { homepageText } from "../../texts";
/** Homepage of site.
 *
 * Routes -> Homepage
 */

function Homepage() {

    return (
        <div className="Homepage">
            <div className="container text-center">
                <h1 className="mb-4 font-weight-bold">Welcome to Stocktrends</h1>
                <p className="lh-base">{homepageText}</p>
                <Link className="btn btn-primary font-weight-bold mr-3"
                    to="/strategies">
                    Strategies
                </Link>
            </div>
        </div>
    );
}

export default Homepage;