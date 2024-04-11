
# Stocktrends

- **URL: [https://anic12.github.io/stocktrends/](https://anic12.github.io/stocktrends/)**
- **GitHub Repository: [https://github.com/AniC12/stocktrends](https://github.com/AniC12/stocktrends)**

## Description ##
Stocktrends is an interactive web application designed to help both novice and experienced investors understand and navigate the complexities of the stock market. Users can explore various investment strategies, monitor performance through intuitive charts, and manage personalized investment portfolios.

## Implemented Features ##
- User Authentication: Register, log in, and guest access features ensure personalized and secure access to investment tools.
- Strategy Exploration: Users can review detailed descriptions and performance histories of different investment strategies to make informed decisions.
- Portfolio Management: Users can create, modify, and monitor investment portfolios based on chosen strategies. Features include adding/removing stocks and adjusting allocations.
- Real-Time Performance Charts: Utilizing Chart.js to dynamically display the historical performance and current valuation of user portfolios.
- Responsive Design: Ensures a seamless experience across various devices and screen sizes using Bootstrap.
 

These features were chosen to provide a comprehensive toolset for personal investment management, reflecting real-world needs for flexibility, security, and information accessibility in investment decision-making.


## Tests ##

- Frontend Tests: Run `npm test` from the root of the frontend directory.
- Backend Tests: Run `jest` or `npm test` in the backend directory, ensuring all environment variables are correctly set for test configurations.


## User Flow ##

- Visit the Homepage: Start at the homepage where you can learn about Stocktrends and navigate to view strategies or manage portfolios.
- Explore Strategies: Click on the "Strategies" link to view available investment strategies. Each strategy includes performance data and descriptions.
- Sign Up/Login: To create and manage portfolios, sign up for a new account or log in.
- Create a Portfolio: Navigate to "My Portfolios", then use the "Create Portfolio" button to select a strategy and initialize a portfolio.
- Manage Portfolio: Adjust the composition of your portfolio by adding or removing stocks and changing the investment amounts.
- View Performance: Use the chart tools to visualize portfolio performance over time.

## Finnhub API ##

The application uses the [https://finnhub.io/docs/api](https://finnhub.io/docs/api) to retrieve data

## Technology Stack ##

- Frontend: React, Bootstrap for styling, Chart.js for data visualization
- Backend: Node.js with Express for the server, PostgreSQL for the database
- Deployment: The backend of Stocktrends is deployed on Heroku, uses Heroku Postgres as the database service, the frontend is deployed using GitHub Pages

