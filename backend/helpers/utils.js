const Stock = require("../models/stock");
const axios = require('axios');
const myApiKey = require("../apiKey")

async function getStockPrice(symbol) {

    const dbStock = Stock.getBySymbol(symbol);

    if (dbStock && dbStock.price > 0 && dbStock.updateDate === today) {
        return dbStock.price;
    }

    // Todo: make api call
    const apiStock = {symbol: symbol, price: 100, companyName:"Microsoft"};

    if (dbStock) {
        Stock.updatePrice(dbStock.id, apiStock.price, getNow());
    } else {
        Stock.add(symbol, apiStock.companyName, apiStock.price, getNow());
    }
    
    return apiStock.price;
}

function getNow() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0 indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const dateString = `${year}${month}${day}${hours}${minutes}${seconds}`;
    return parseInt(dateString, 10);
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

    currentArray.forEach(({symbol, data}) => {
        if (newMap.has(symbol)) {
            const data2 = newMap.get(symbol);
            const difference = data.amount - data2.amount;
            if (difference > 0) {
                sell.push({symbol, amount: difference, price: data.price});
                update.push({symbol, amount: data2.amount, price: data.price});
            }
        } else {
            sell.push({symbol, amount: data.amount, price: data.price});
            remove.push({symbol, amount: data.amount, price: data.price});
        }
    });

    newArray.forEach(({symbol, data}) => {
        if (currentMap.has(symbol)) {
            const data2 = currentMap.get(symbol);
            const difference = data.amount - data2.amount;
            if (difference > 0) {
                buy.push({symbol, amount: difference, price: data.price});
                update.push({symbol, amount: data2.amount, price: data.price});
            }
        } else {
            buy.push({symbol, amount: data.amount, price: data.price});
            insert.push({symbol, amount: data.amount, price: data.price});
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
        if (!(price > 0 && stock.priceUpdateDate === Utils.getNow())) {
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

    const suggestedStocks = SuggestedPortfolio.findAllForStrategy(strategyId);

    const enrichStocksData = await enrichStocks(suggestedStocks);

    const retValStocks = [];

    let totalAmount = 0;
    enrichStocksData.enrichedStocks.forEach(s => {total += s.amount;});

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
    getNow, 
    calculateStockArraysDiffs, 
    enrichStocks, 
    calculateSuggestedPortfolio };
