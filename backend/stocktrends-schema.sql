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
    start_date INTEGER
);

CREATE TABLE userStocks (
    id SERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
    amount FLOAT NOT NULL,
    purchase_date INTEGER NOT NULL,
    purchase_price FLOAT NOT NULL,
    sold_date INTEGER,
    sold_price FLOAT
);

CREATE TABLE marketData (
    id SERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    date INTEGER NOT NULL,
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
    date_interval TEXT NOT NULL,
    rate FLOAT NOT NULL
);

CREATE TABLE strategyPerformanceHistory (
    id SERIAL PRIMARY KEY,
    strategy_id INTEGER REFERENCES strategies(id) ON DELETE CASCADE,
    date INTEGER NOT NULL,
    return_rate FLOAT NOT NULL
);

CREATE TABLE transactionHistory (
    id SERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price FLOAT NOT NULL,
    date INTEGER NOT NULL,
    transaction_type INTEGER NOT NULL
);

CREATE TABLE portfolioValueHistory (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
    date INTEGER NOT NULL,
    value FLOAT NOT NULL
);

CREATE TABLE suggestedPortfolio (
    id SERIAL PRIMARY KEY,
    strategy_id INTEGER REFERENCES strategies(id) ON DELETE CASCADE,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    amount FLOAT NOT NULL
);


INSERT INTO strategies (id, strategy_name, return_rate, criteria, description)
VALUES
(1, 'Market Cap 10', 13.1, 'Market cap investing strategy involves selecting stocks based on the total market value of a company''s outstanding shares', 'Market capitalization investing is a strategy that prioritizes investments in companies based on their total market value, calculated by multiplying a company''s share price by its total number of outstanding shares. This approach categorizes companies into different segments: large-cap, mid-cap, and small-cap, each offering distinct risk and reward profiles. Large-cap companies, typically valued at $10 billion or more, are often industry leaders and offer stability and steady growth, making them attractive to risk-averse investors. Mid-cap companies, with market values between $2 billion and $10 billion, strike a balance between the rapid growth potential of small-caps and the stability of large-caps. Small-cap companies, valued under $2 billion, are considered higher risk but offer the potential for significant returns due to their growth potential.

Investing based on market cap focuses on the theory that the size of a company can influence its investment characteristics. Large-cap stocks are generally considered safer investments; they usually have more predictable revenue streams and have proven resilient in diverse economic conditions. These companies often pay regular dividends, providing an income stream in addition to capital appreciation. On the other hand, small and mid-cap stocks might not be as stable but offer higher growth potential. They are more likely to reinvest profits into the business rather than pay dividends, which can lead to higher stock price appreciation over time if the company grows successfully.

Market cap investing allows investors to tailor their portfolio according to their risk tolerance and investment goals. For example, a conservative investor may prefer a portfolio weighted towards large-cap stocks for their stability and potential for steady returns. In contrast, a more aggressive investor might favor small or mid-cap stocks for their growth potential, accepting the higher risk that comes with these investments.

One popular method within market cap investing is to focus on the top companies by market capitalization within a particular index, sector, or globally. This strategy operates on the premise that companies with higher market capitalizations are less likely to fail, thereby offering a safer investment option. Additionally, by investing in companies that dominate their industries, investors can benefit from these companies'' continued growth and market dominance.

However, market cap investing is not without its drawbacks. A significant risk is market cap concentration, where the largest companies by market cap can disproportionately influence an index or fund''s performance, potentially exposing investors to unexpected volatility if these companies'' stock prices fall. Moreover, this strategy may lead investors to overlook smaller companies with the potential for significant growth, missing out on higher returns.

In conclusion, market cap investing offers a straightforward, strategic approach to building a diversified investment portfolio. By understanding the characteristics and risk profiles associated with different market cap segments, investors can make informed decisions aligned with their financial objectives. Like all investment strategies, market cap investing requires ongoing monitoring and adjustment to respond to market changes and personal financial goals.'),
(2, 'Moving Averages', 10.3, 'The moving averages investing strategy focuses on using the average price of a security over a specified period to identify trends and make buy or sell decisions based on the direction of the moving average line', 'Moving averages are a foundational tool in financial analysis, offering a streamlined view of price trends by smoothing out short-term fluctuations and highlighting longer-term directions. At their core, moving averages are calculated by averaging a stock''s price over a specific period, such as 50 or 200 days, and then plotting this average over time alongside the stock''s price chart. This process is repeated daily, creating a flowing line that traders and investors use to assess momentum and market direction.

There are two primary types of moving averages: the Simple Moving Average (SMA) and the Exponential Moving Average (EMA). The SMA calculates the average price over a defined number of days, giving equal weight to each day''s price. In contrast, the EMA gives more weight to recent prices, making it more responsive to new information and quicker to reflect changes in market sentiment.

Moving averages serve multiple purposes: they can act as support or resistance levels, indicate buy or sell signals, and help identify trend reversals. A common strategy involves observing the crossover of short-term and long-term moving averages. For example, a buy signal is often indicated when a short-term moving average crosses above a long-term moving average, suggesting that an uptrend is beginning. Conversely, a sell signal is suggested when the short-term moving average crosses below the long-term average, indicating a potential downtrend.

Moreover, moving averages can be customized to any time frame, allowing traders to adapt them to both short-term trading and long-term investment strategies. This versatility makes moving averages an indispensable tool in the technical analyst''s toolkit, providing a simple yet powerful way to interpret market dynamics.

Despite their utility, moving averages should not be used in isolation. They work best when combined with other indicators and analysis techniques, offering a more comprehensive view of market conditions. This approach helps to mitigate risks and enhance decision-making, making moving averages a crucial component of a diversified trading strategy.'),
(3, 'Value Investing', 10.1, 'Value investing strategy involves selecting stocks that appear to be trading for less than their intrinsic or book value, aiming to invest in undervalued companies with strong fundamentals for long-term growth', 'Value Investing is a strategy centered around the idea of finding stocks that appear to be undervalued by the market. This approach is based on the belief that the stock market doesn''t always fully reflect the true value of a company due to various factors, including investor sentiment, market trends, and short-term market movements. Value investors seek out companies trading for less than their intrinsic values, often analyzing fundamentals like earnings, dividends, cash flow, and book value to gauge a stock''s true worth.

The essence of Value Investing lies in its focus on long-term investment in fundamentally strong companies at a price that provides a margin of safety, reducing the risk of loss. This margin of safety is the difference between the stock''s intrinsic value and its market price. Benjamin Graham and David Dodd, considered the fathers of Value Investing, emphasized buying securities with a significant discount to their intrinsic value to protect against downside risk.

Warren Buffett, perhaps the most famous value investor, refined this approach by focusing not just on purchasing undervalued stocks, but on companies with durable competitive advantages, excellent management, and the potential for long-term growth. This evolution underscores a blend of quantitative and qualitative analysis, where the financial metrics must be complemented by an understanding of the company''s business model, industry position, and growth prospects.

Value Investing demands patience, as undervalued stocks may remain undervalued for extended periods before the market recognizes their true value. Moreover, this strategy requires rigorous research and discipline, as investors must be willing to diverge from popular market trends and opinions. The ultimate goal is not to follow the herd but to buy stocks for less than they''re worth and wait for the market to adjust to their true value, potentially leading to significant returns over time.

This investment philosophy inherently assumes that the stock market is inefficient in the short term but that price and value will converge over time. Despite its potential for high returns, Value Investing also carries risks, including the possibility that some stocks are undervalued due to fundamental issues within the company that may not improve. Hence, thorough due diligence and a keen understanding of the company and its industry are crucial components of successful Value Investing.')
;



INSERT INTO strategyPerformanceHistory (strategy_id, date, return_rate) VALUES
(1, 2004, 24.69),
(1, 2005, 19.16),
(1, 2006, 7.92),
(1, 2007, 23.64),
(1, 2008, -40.0),
(1, 2009, 3.15),
(1, 2010, 21.1),
(1, 2011, 22.55),
(1, 2012, 21.38),
(1, 2013, 24.77),
(1, 2014, 22.82),
(1, 2015, 8.11),
(1, 2016, 11.41),
(1, 2017, 12.59),
(1, 2018, 24.24),
(1, 2019, 4.5),
(1, 2020, -5.0),
(1, 2021, 21.89),
(1, 2022, 21.82),
(1, 2023, 16.68);

INSERT INTO strategyPerformanceHistory (strategy_id, date, return_rate) VALUES
(2, 2004, 11.53),
(2, 2005, 7.26),
(2, 2006, 14.81),
(2, 2007, 11.95),
(2, 2008, -15.0),
(2, 2009, 9.76),
(2, 2010, 8.55),
(2, 2011, 12.69),
(2, 2012, 13.32),
(2, 2013, 13.91),
(2, 2014, 13.34),
(2, 2015, 14.3),
(2, 2016, 11.78),
(2, 2017, 14.76),
(2, 2018, 14.1),
(2, 2019, 10.44),
(2, 2020, -5.0),
(2, 2021, 14.63),
(2, 2022, 14.38),
(2, 2023, 13.83);

INSERT INTO strategyPerformanceHistory (strategy_id, date, return_rate) VALUES
(3, 2004, 9.59),
(3, 2005, 14.78),
(3, 2006, 13.17),
(3, 2007, 11.48),
(3, 2008, -19.0),
(3, 2009, 13.91),
(3, 2010, 10.75),
(3, 2011, 13.37),
(3, 2012, 9.9),
(3, 2013, 13.39),
(3, 2014, 14.76),
(3, 2015, 14.16),
(3, 2016, 14.36),
(3, 2017, 13.05),
(3, 2018, 14.26),
(3, 2019, 10.18),
(3, 2020, -5.0),
(3, 2021, 12.41),
(3, 2022, 11.01),
(3, 2023, 11.61);

INSERT INTO stocks (id, ticket_symbol, company_name) VALUES
(1, 'MSFT', 'Microsoft Corporation'),
(2, 'AAPL', 'Apple Inc.'),
(3, 'NVDA', 'Nvidia Corporation'),
(4, '2222.SR', 'Saudi Aramco'),
(5, 'GOOG', 'Alphabet Inc.'),
(6, 'AMZN', 'Amazon.com, Inc.'),
(7, 'META', 'Meta Platforms, Inc.'), 
(8, 'BRK-B', 'Berkshire Hathaway Inc.'),
(9, 'LLY', 'Eli Lilly and Company'),
(10, 'TSM', 'Taiwan Semiconductor Manufacturing Company'),
(11, 'RDDT', 'Reddit, Inc.'),
(12, 'TSLA', 'Tesla, Inc.'),
(13, 'SMCI', 'Super Micro Computer, Inc.'),
(14, 'LULU', 'Lululemon Athletica Inc.'),
(15, 'AUNA', 'Auna S.A.'),
(16, 'MRNO', 'Murano Global Investments PLC'),
(17, 'ALAB', 'Astera Labs, Inc.'),
(18, 'SOUN', 'SoundHound AI, Inc.'),
(19, 'CAT', 'Caterpillar Inc.'),
(20, 'ABBV', 'AbbVie Inc.'),
(21, 'DE', 'Deere & Company'),
(22, 'CVX', 'Chevron Corporation'),
(23, 'GE', 'General Electric Company'),
(24, 'BK', 'The Bank of New York Mellon Corporation'),
(25, 'DAL', 'Delta Air Lines, Inc.'),
(26, 'AIG', 'American International Group, Inc.'),
(27, 'GIS', 'General Mills, Inc.'),
(28, 'JNJ', 'Johnson & Johnson');

INSERT INTO suggestedPortfolio (strategy_id, stock_id, amount) VALUES
(1, 1, 3185000),  -- MSFT
(1, 2, 2660000),  -- AAPL
(1, 3, 2357000),  -- NVDA
(1, 4, 2012000),  -- 2222.SR
(1, 5, 1879000),  -- GOOG
(1, 6, 1857000),  -- AMZN
(1, 7, 1299000),  -- META
(1, 8, 890100),   -- BRK-B
(1, 9, 732200),   -- LLY
(1, 10, 728980),  -- TSM
(2, 11, 1), -- RDDT
(2, 12, 1), -- TSLA
(2, 13, 1), -- SMCI
(2, 14, 1), -- LULU
(2, 15, 1), -- AUNA
(2, 16, 1), -- MRNO
(2, 17, 1), -- ALAB
(2, 18, 1), -- SOUN
(2, 3, 1), -- NVDA
(2, 2, 1), -- AAPL
(3, 21, 31), -- DE
(3, 22, 32), -- CVX
(3, 23, 33), -- GE
(3, 24, 34), -- BK
(3, 25, 35), -- DAL
(3, 26, 36), -- AIG
(3, 27, 37), -- GIS
(3, 28, 38), -- JNJ
(3, 19, 39), -- CAT
(3, 20, 40); -- ABBV
