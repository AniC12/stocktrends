import React from 'react';
import Table from 'react-bootstrap/Table';

const TransactionHistory = ({ transactionHistory }) => {
  return (
    <div>
      <h3>Transaction history</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>DATE</th>
            <th>SYMBOL</th>
            <th>QUANTITY</th>
            <th>PRICE</th>
            <th>TYPE</th>
          </tr>
        </thead>
        <tbody>
          {transactionHistory.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.date}</td>
              <td>{transaction.symbol}</td>
              <td>{transaction.quantity}</td>
              <td>{transaction.price}</td>
              <td>{transaction.transactionType}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TransactionHistory;
