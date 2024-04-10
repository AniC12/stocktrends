const Stock = require("../models/stock");
const axios = require('axios');
const API_KEY = require("../apiKey");
const SuggestedPortfolio = require("../models/suggestedPortfolio");

async function getStockPrice(symbol) {

    // const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`;
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY.finnhubApiKey}`;
    
    try {
        const dbStock = await Stock.getBySymbol(symbol);

        if (dbStock && dbStock.price > 0 && dbStock.updateDate.getTime() === getToday().getTime()) {
            return dbStock.price;
        }

        // Todo: make api call
        const response = await axios.get(url);
        const data = response.data;
        const price = parseFloat(data["c"]);
        

        // Update or add the stock with the new price
        if (dbStock) {
            await Stock.updatePrice(dbStock.id, price, getToday());
        } else {
            await Stock.add(symbol, price, getToday());
        }

        return price;
    } catch (err) {
        console.error("Error fetching stock price:", err);
        throw new Error("Failed to fetch stock price");
    }

}

function getToday() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return today;
}

function calculateStockArraysDiffs(currentArray, newArray) {
    const remove = [];
    const insert = [];
    const update = [];
    const sell = [];
    const buy = [];

    // Convert both arrays to maps for efficient lookup
    const currentMap = new Map(currentArray.map(item => [item.symbol, {amount: item.amount, price: item.price}]));
    const newMap = new Map(newArray.map(item => [item.symbol, {amount: item.amount, price: item.price}]));

   currentMap.forEach((currentData, symbol) => {
        if (newMap.has(symbol)) {
            const newData = newMap.get(symbol);
            const difference = currentData.amount - newData.amount;
            if (difference > 0) {
                sell.push({ symbol, amount: difference, price: currentData.price });
                update.push({ symbol, amount: newData.amount, price: currentData.price });
            }
        } else {
            sell.push({ symbol, amount: currentData.amount, price: currentData.price });
            remove.push({ symbol, amount: currentData.amount, price: currentData.price });
        }
    });

    newMap.forEach((newData, symbol) => {
        if (currentMap.has(symbol)) {
            const currentData = currentMap.get(symbol);
            const difference = newData.amount - currentData.amount;
            if (difference > 0) {
                buy.push({ symbol, amount: difference, price: newData.price });
                update.push({ symbol, amount: newData.amount, price: newData.price });
            }
        } else {
            buy.push({ symbol, amount: newData.amount, price: newData.price });
            insert.push({ symbol, amount: newData.amount, price: newData.price });
        }
    });

    return {sell, buy, remove, update, insert};
}

async function enrichStocks(stocks) {
    const enrichedStocks = []; // Initialize an empty array for the results
    let totalValue = 0;

    for (const stock of stocks) {
        let price = stock.price;
        // Check if the price needs to be updated
        if (!(price > 0 && stock.priceUpdateDate === getToday())) {
            price = await getStockPrice(stock.symbol); // Await the async call within the loop
        }
        const value = price * stock.amount;
        totalValue += value;
        // Push the enriched stock object into the array
        enrichedStocks.push({ ...stock, price, value });
    }

    return {enrichedStocks, totalValue};
}

async function calculateSuggestedPortfolio(strategyId, cash) {

    const suggestedStocks = await SuggestedPortfolio.findAllForStrategy(strategyId);

    const enrichStocksData = await enrichStocks(suggestedStocks);

    const retValStocks = [];

    let totalAmount = 0;
    enrichStocksData.enrichedStocks.forEach(s => {totalAmount += s.amount;});

    for (const stock of enrichStocksData.enrichedStocks) {
        const portion = stock.amount / totalAmount;
        const value = cash * portion;
        const amount = value / stock.price;
        retValStocks.push({ ...stock, amount, value });
    }

    return retValStocks;
}

module.exports = { 
    getStockPrice, 
    getToday, 
    calculateStockArraysDiffs, 
    enrichStocks, 
    calculateSuggestedPortfolio };
