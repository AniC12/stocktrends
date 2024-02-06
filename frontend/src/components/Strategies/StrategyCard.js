import React from "react";
import { Link } from "react-router-dom";

/** Show limited information about a startegy
 *
 * Is rendered by StrategyList to show a "card" for each startegy.
 *
 * StrategyList -> StrategyCard
 */

function StrategyCard({ name, description, logoUrl, id }) {

    return (
        <Link className="StrategyCard card" to={`/strategies/${id}`}>
            <div className="card-body">
                <h6 className="card-title">
                    {name}
                </h6>
                <p><small>{description}</small></p>
            </div>
        </Link>
    );
}

export default StrategyCard;