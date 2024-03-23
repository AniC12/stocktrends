import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StocktrendsApi from "../../api/api";
import LoadingSpinner from "../common/LoadingSpinner";

function StrategyDetail() {
    const { id } = useParams();

    const [strategy, setStrategy] = useState(null);

    useEffect(() => {
        async function getStrategy() {
            setStrategy(await StocktrendsApi.getStrategy(id));
        }

        getStrategy();
    }, [id]);

    if (!strategy) return <LoadingSpinner />;

    return (
        <div className="StrategyDetail col-md-8 offset-md-2">
          <h4>{strategy.name}</h4>
          <p>{strategy.description}</p>
          <p>Chart will be here</p>
          <button type="button" className="btn btn-outline-primary">Creat Portfolio for this Strategy</button>
          <button type="button" className="btn btn-outline-primary">Go to My Portfolio for this Strategy</button>
        </div>
    );
}

export default StrategyDetail;