import React, { useState, useEffect } from "react";
import StocktrendsApi from "../api/api";
import StrategyCard from "./StrategyCard";
import LoadingSpinner from "../common/LoadingSpinner";

/** Show page with list of strategies.
 *
 * On mount, loads strategies from API.
 * This is routed to at /strategies
 *
 * Routes -> StrategyCard
 */

function StrategyList() {

    const [strategies, setStrategies] = useState(null);

    useEffect(() => {
        async function getStrategies() {
            let strategies = await StocktrendsApi.getStrategies();
            setStrategies(strategies);
        }

        getStrategies();
    }, []);

    if (!strategies) return <LoadingSpinner />;

    return (
        <div className="StrategyList col-md-8 offset-md-2">
            {strategies.length
                ? (
                    <div className="CompanyList-list">
                        {strategies.map(s => (
                            <StrategyCard
                                key={s.id}
                                name={s.name}
                                description={s.description}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="lead">Sorry, no results were found!</p>
                )}
        </div>
    );
}

export default StrategyList;
