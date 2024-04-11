import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StocktrendsApi from "../../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import MyChart from "../chart/MyChart";

function StrategyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [strategy, setStrategy] = useState(null);
    const [performanceHistory, setPerformanceHistory] = useState(null);

    useEffect(() => {
        async function getStrategyInfo() {
            setStrategy(await StocktrendsApi.getStrategy(id));
            setPerformanceHistory(await StocktrendsApi.getStrategyPerformanceHistory(id))
        }

        getStrategyInfo();
    }, [id]);

    if (!strategy || !performanceHistory) return <LoadingSpinner />;

    const handleNavigate = () => {
        navigate("/portfolios");  // Navigate to portfolios page
    };

    return (
        <div className="StrategyDetail col-md-8 offset-md-2">
            <h4>{strategy.strategyName}</h4>
            <p>{strategy.description}</p>
            
            <MyChart data={performanceHistory.map((entry) => ({date: entry.year, value: entry.returnRate}))}
                title={'Strategy Performance'}
                xLabel={"Date"}
                yLabel={"Return Rate (%)"} />
            <button type="button" className="btn btn-outline-primary" onClick={handleNavigate}>Go to My Portfolios</button>
        </div>
    );
}

export default StrategyDetail;