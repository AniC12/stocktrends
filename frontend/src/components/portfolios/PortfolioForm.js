import React, { useState, useEffect } from 'react';
import { Button, Form, ListGroup, InputGroup, FormControl } from 'react-bootstrap';
import StocktrendsApi from '../../api/api';
import LoadingSpinner from "../common/LoadingSpinner";

const PortfolioForm = ({ initialPortfolioFullWithValues, onSave }) => {
    const [portfolioFullWithValues, setPortfolio] = useState(initialPortfolioFullWithValues);

    useEffect(() => {
        // Sync the state with the new prop value
        setPortfolio(initialPortfolioFullWithValues);
    }, [initialPortfolioFullWithValues]); // Only re-run the effect if initialPortfolioFullWithValues changes


    const handleCashChange = (e) => {
        setPortfolio({
            ...portfolioFullWithValues,
            portfolio: {
              ...portfolioFullWithValues.portfolio,
              availableCash: e.target.value
            }
          });
    };

    const handleStockChange = (index, key, value) => {
        const updatedStocks = [...portfolioFullWithValues.stocks];
        updatedStocks[index][key] = value;
        setPortfolio({ ...portfolioFullWithValues, stocks: updatedStocks });
    };

    const handleAddStock = () => {
        setPortfolio({
            ...portfolioFullWithValues,
            stocks: [...portfolioFullWithValues.stocks, { symbol: '', amount: 0 }]
        });
    };

    const handleDeleteStock = (index) => {
        const updatedStocks = [...portfolioFullWithValues.stocks];
        updatedStocks.splice(index, 1);
        setPortfolio({ ...portfolioFullWithValues, stocks: updatedStocks });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const upd = await StocktrendsApi.savePortfolio(portfolioFullWithValues);
        console.log("upd", upd);
        setPortfolio(upd);
        console.log("updatedPortfolioFullWithValues", portfolioFullWithValues);
        onSave(portfolioFullWithValues);
        console.log("updatedPortfolioFullWithValues", portfolioFullWithValues);
    };

    if (!portfolioFullWithValues) return <LoadingSpinner />;

    return (
        <Form onSubmit={handleSubmit}>
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <strong>Total Value: </strong>
                    {`$${portfolioFullWithValues.totalValue}`}
                </ListGroup.Item>
                <ListGroup.Item>
                    <InputGroup className="mb-2">
                        <InputGroup.Text>Cash</InputGroup.Text>
                        <FormControl
                            type="number"
                            value={portfolioFullWithValues.portfolio.availableCash}
                            onChange={handleCashChange}
                        />
                    </InputGroup>
                </ListGroup.Item>
                {portfolioFullWithValues.stocks.map((stock, index) => (
                    <ListGroup.Item key={index}>
                        <InputGroup className="mb-2">
                            <FormControl
                                value={stock.symbol}
                                onChange={(e) => handleStockChange(index, 'symbol', e.target.value)}
                                placeholder="Stock name"
                            />
                            <FormControl
                                type="number"
                                value={stock.amount}
                                onChange={(e) => handleStockChange(index, 'amount', +e.target.value)}
                                placeholder="Amount"
                            />
                            <Button variant="outline-danger" onClick={() => handleDeleteStock(index)}>
                                Delete
                            </Button>
                        </InputGroup>
                    </ListGroup.Item>
                ))}
                <ListGroup.Item>
                    <Button variant="outline-primary" onClick={handleAddStock}>
                        Add new stock
                    </Button>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Button type="submit" variant="success">
                        SAVE
                    </Button>
                </ListGroup.Item>
            </ListGroup>
        </Form>
    );
};

export default PortfolioForm;
