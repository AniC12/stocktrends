import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import StocktrendsApi from '../../api/api';
import LoadingSpinner from "../common/LoadingSpinner";

function ApplyStrategyModal({ portfolioId, show, handleCancel, handleConfirm }) {
    const [transactions, setTransactions] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            const transactionList = await StocktrendsApi.applyStrategy(portfolioId, false);
            console.log("transactionList",transactionList);
            setTransactions(transactionList);
        };
        if (show) {
            fetchTransactions();
        }
        
    }, [show, portfolioId]);

    if (!transactions) return <LoadingSpinner />;

    return (
        <Modal show={show} onHide={handleCancel}>
            <Modal.Header closeButton>
                <Modal.Title>Apply strategy</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div>
                    <h3>Buy stocks</h3>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>SYMBOL</th>
                            <th>QUANTITY</th>
                            <th>PRICE</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.buy.map((transaction, index) => (
                            <tr key={index}>
                            <td>{transaction.symbol}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.price}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
                
                <div>
                    <h3>Sell stocks</h3>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>SYMBOL</th>
                            <th>QUANTITY</th>
                            <th>PRICE</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.sell.map((transaction, index) => (
                            <tr key={index}>
                            <td>{transaction.symbol}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.price}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ApplyStrategyModal;
