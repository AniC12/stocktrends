import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StocktrendsApi from "../../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import MyChart from "../chart/MyChart";
import PortfolioForm from "./PortfolioForm";
import TransactionHistory from "./TransactionHistory";
import ApplyStrategyModal from "./ApplyStrategyModal";

function PortfolioDetail() {
    const { id } = useParams();

    const [portfolioFullWithValues, setPortfolioFullWithValues] = useState(null);
    const [valueHistory, setValueHistory] = useState(null);
    const [transactionHistory, setTranscationHistory] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function getPortfolioFullWithValuesInfo() {
            setPortfolioFullWithValues(await StocktrendsApi.getPortfolioFullWithValues(id));
            setValueHistory(await StocktrendsApi.getPortfolioValueHistory(id));
            setTranscationHistory(await StocktrendsApi.getPortfolioTransactionHistory(id));
        }

        getPortfolioFullWithValuesInfo();
    }, [id]);

    async function refreshData (updatedPortfolioFullWithValues) {
        console.log("updatedPortfolioFullWithValues", updatedPortfolioFullWithValues);
        setPortfolioFullWithValues(await StocktrendsApi.getPortfolioFullWithValues(id));
        setValueHistory(await StocktrendsApi.getPortfolioValueHistory(id));
        setTranscationHistory(await StocktrendsApi.getPortfolioTransactionHistory(id));
    };
    
    const handleApplyStrategyClick = () => {
        console.log('Opening modal...');
        setShowModal(true);
    };
    
    async function applyStrategy () {
        setShowModal(false);
        await refreshData (await StocktrendsApi.applyStrategy(id, true));
    };

    if (!portfolioFullWithValues || !valueHistory || !transactionHistory) return <LoadingSpinner />;

    return (
        <div className="PortfolioDetail col-md-8 offset-md-2">
            <h3>{portfolioFullWithValues.portfolio.portfolioName}</h3>
            <PortfolioForm initialPortfolioFullWithValues={portfolioFullWithValues} onSave={refreshData} />
            <br/><br/><br/>
            <button className="btn btn-primary btn-lg" onClick={handleApplyStrategyClick}>Apply strategy</button>
            {showModal && <ApplyStrategyModal 
                    portfolioId={portfolioFullWithValues.portfolio.id} 
                    show={showModal} 
                    handleConfirm={applyStrategy}
                    handleCancel={() => setShowModal(false)} />}
            <br/><br/><br/>
            <MyChart data={valueHistory} 
                title={'Portfolio performance'}
                xLabel={"Date"}
                yLabel={"Portfolio Value"}/>
            <br/><br/><br/>
            <TransactionHistory transactionHistory={transactionHistory} />
        </div>
    );
}

export default PortfolioDetail;