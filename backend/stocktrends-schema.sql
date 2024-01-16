CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL CHECK (position('@' IN email) > 1),
    password TEXT NOT NULL
);

CREATE TABLE strategies (
    id SERIAL PRIMARY KEY,
    strategy_name TEXT NOT NULL,
    criteria TEXT NOT NULL,
    description TEXT NOT NULL,
    return_rate FLOAT NOT NULL
);

CREATE TABLE portfolios (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    portfolio_name TEXT NOT NULL,
    creation_date DATE NOT NULL,
    available_cash FLOAT NOT NULL,
    strategy_id INTEGER REFERENCES strategies(id) ON DELETE CASCADE
);

CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    ticket_symbol TEXT NOT NULL,
    company_name TEXT NOT NULL,
    start_date DATE NOT NULL
);

CREATE TABLE userStocks (
    id SERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
    amount FLOAT NOT NULL,
    purchase_price FLOAT NOT NULL,
    purchase_date DATE NOT NULL,
    sold_date DATE NOT NULL,
    sold_price FLOAT NOT NULL
);

CREATE TABLE marketData (
    id SERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    open_price FLOAT NOT NULL,
    close_price FLOAT NOT NULL,
    high FLOAT NOT NULL,
    low FLOAT NOT NULL,
    volume FLOAT NOT NULL,
    market_capitalization FLOAT NOT NULL
);

CREATE TABLE returnRates (
    id SERIAL PRIMARY KEY,
    strategy_id INTEGER REFERENCES strategies(id) ON DELETE CASCADE,
    date_interval DATE NOT NULL,
    rate FLOAT NOT NULL
);

CREATE TABLE strategyPerformanceHistory (
    id SERIAL PRIMARY KEY,
    strategy_id INTEGER REFERENCES strategies(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    amount FLOAT NOT NULL
);

CREATE TABLE transactionHistory (
    id SERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price FLOAT NOT NULL,
    date DATE NOT NULL,
    transaction_type INTEGER NOT NULL
);

CREATE TABLE portfolioValueHistory (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    value FLOAT NOT NULL
);
