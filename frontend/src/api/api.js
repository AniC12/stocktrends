import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;// || "http://localhost:30015";

console.log(BASE_URL);

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * 
 */

class StocktrendsApi {
    // the token for interactive with the API will be stored here.
    static token = localStorage.getItem("token") || null;

    static async request(endpoint, data = {}, method = "get") {

        if (!this.token) {
            await this.createGuestUser();
        }
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${StocktrendsApi.token}` };
        const params = (method === "get")
            ? {}
            : data;
        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    static async createGuestUser() {
        try {
            const res = await axios.post(`${BASE_URL}/users/createguest`);
            this.token = res.data.token;
            localStorage.setItem("token", this.token);
        } catch (err) {
            console.error("Could not create guest user", err);
            throw new Error("Could not create guest user");
        }
    }

    // Individual API routes

    /** Get strategies */

    static async getStrategies() {
        let res = await this.request("strategies");
        return res.strategies;
    }

    /** Get strategies that don't have portfolios*/

    static async getUnusedStrategies() {
        try {
            let res = await this.request("strategies/unused");
            console.log(res);
            return res.strategies;
        } catch (err) {
            console.error("Error getting strategies without portfolios:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }


    /** Get details on a strategy by id. */

    static async getStrategy(id) {
        let res = await this.request(`strategies/${id}`);
        return res.strategy;
    }

    /** Get the list of portfolios */

    static async getPortfolios() {
        let res = await this.request("portfolios");
        return res.portfolios;
    }

    /** Get details on a portfolio by id */

    static async getPortfolio(id) {
        let res = await this.request(`portfolios/${id}`);
        return res.portfolio;
    }

    /** Get details on a portfolio by id */

    static async getPortfolioFullWithValues(id) {
        let res = await this.request(`portfolios/fullWithValues/${id}`);
        return res.portfolioFullWithValues;
    }

    /** Get details on a portfolio by id */

    static async getPortfolioFull(id) {
        let res = await this.request(`portfolios/full/${id}`);
        return res.portfolioFull;
    }

    /** Get details on a portfolio by id */

    static async getPortfolioValueHistory(id) {
        let res = await this.request(`portfolios/valuehistory/${id}`);
        return res.portfolioValueHistory;
    }

    /** Get details on a portfolio by id */

    static async getPortfolioTransactionHistory(id) {
        let res = await this.request(`portfolios/transactionhistory/${id}`);
        return res.transactionValueHistory;
    }

    /**Create a new portfolio */

    static async createPortfolio(strategy) {
        try {
            const data = { portfolioName : strategy.strategyName, strategyId: strategy.id };
            let res = await this.request("portfolios", data, "post");
            return res.portfolio;
        } catch (err) {
            console.error("Error creating portfolio with strategy:", err);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    static async savePortfolio(portfolioFullWithDetails) {
        try {
            const data = { availableCash : portfolioFullWithDetails.portfolio.availableCash, 
                stocks: portfolioFullWithDetails.stocks };
                const id = portfolioFullWithDetails.portfolio.id;
            let res = await this.request(`portfolios/save/${id}`, data, "post");
            return res.portfolioFullWithValues;
        } catch (err) {
            console.error("Error creating portfolio with strategy:", err);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    static async applyStrategy(portfolioId, confirm) {
        try {
            const data = { confirm : confirm };
            let res = await this.request(`portfolios/applystrategy/${portfolioId}`, data, "post");
            if (confirm)
                return res.portfolioFullWithValues;
            return res.transactions;
        } catch (err) {
            console.error("Error applying strategy :", err);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    /** Get the current user. */

    static async getCurrentUser() {
        let res = await this.request(`users/`);
        return res.user;
    }

    /** Get token for login from username, password. */

    static async login(data) {
        let res = await this.request(`users/login`, data, "post");
        return res.token;
    }

    /** Signup for site. */

    static async signup(data) {
        let res = await this.request(`users/register`, data, "post");
        return res.token;
    }

    /** Get performance history for a strategy by id. */

    static async getStrategyPerformanceHistory(strategyId) {
        let res = await this.request(`strategyPerformanceHistory/${strategyId}`);
        return res.performanceHistory;
    }
}

export default StocktrendsApi;