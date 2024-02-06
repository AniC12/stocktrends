import React from 'react';
import Navigation from './components/routes-nav/Navigation';
import { BrowserRouter } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation />
        <div>
          <h1>Welcome to StockTrends</h1>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
