import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import StocktrendsApi from '../../api/api';

function PortfolioModal({ show, handleClose }) {
    const [strategies, setStrategies] = useState([]);
    const [selectedStrategyId, setSelectedStrategyId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStrategies = async () => {
            const unusedStrategies = await StocktrendsApi.getUnusedStrategies();
            setStrategies(unusedStrategies);
        };
        if (show) {
            fetchStrategies();
        }
        
    }, [show]);

    const handleSave = async () => {
        if (selectedStrategyId) {
            const selectedStrategy = strategies.find(strategy => strategy.id === Number(selectedStrategyId));
            const portfolio = await StocktrendsApi.createPortfolio(selectedStrategy);
            navigate(`/portfolios/${portfolio.id}`);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create Portfolio</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <select
                    className="form-control"
                    value={selectedStrategyId}
                    onChange={e => setSelectedStrategyId(e.target.value)}
                >
                    <option value="">Select Strategy</option>
                    {strategies.map(strategy => (
                        <option key={strategy.id} value={strategy.id}>
                            {strategy.strategyName}
                        </option>
                    ))}
                </select>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Create Portfolio
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PortfolioModal;
