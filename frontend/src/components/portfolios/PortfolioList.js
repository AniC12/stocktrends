import React, { useState, useEffect } from 'react';
import StocktrendsApi from '../../api/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { Link } from 'react-router-dom';
import PortfolioModal from './PortfolioModal';

function PortfolioList() {
    const [portfolios, setPortfolios] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const handleCreatePortfolioClick = () => {
        console.log('Opening modal...');
        setShowModal(true);
    };

    useEffect(() => {
        async function getPortfolios() {
            let portfolios = await StocktrendsApi.getPortfolios();
            setPortfolios(portfolios);
        }
        getPortfolios();
    }, []);

    if (!portfolios) return <LoadingSpinner />;

    return (
        <div className="PortfolioList col-md-8 offset-md-2">
            <h2>My Portfolios</h2>
            {portfolios.length ? (
                <div className="list-group">
                    {portfolios.map(portfolio => (
                        <Link key={portfolio.id} to={`/portfolios/${portfolio.id}`} className="list-group-item list-group-item-action">
                            {portfolio.portfolioName}
                        </Link>
                        
                    ))}
                </div>
            ) : (
                <p className="lead">No portfolios found.</p>
            )}
            <br/><br/><br/><br/><br/><br/>
            <button onClick={handleCreatePortfolioClick}>Create Portfolio</button>
            {showModal && <PortfolioModal show={showModal} handleClose={() => setShowModal(false)} />}
        </div>
    );
}

export default PortfolioList;
