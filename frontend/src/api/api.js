import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * 
 */

class StocktrendsApi {
    // the token for interactive with the API will be stored here.
    static token;

    static async request(endpoint, data = {}, method = "get") {

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

    // Individual API routes

    /** Get strategies */

    static async getStrategies() {
        let res = await this.request("strategies");
        return res.strategies;
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

    /** Get the current user. */

    static async getCurrentUser(username) {
        let res = await this.request(`users/${username}`);
        return res.user;
    }

    /** Get token for login from username, password. */

    static async login(data) {
        let res = await this.request(`auth/token`, data, "post");
        return res.token;
    }

    /** Signup for site. */

    static async signup(data) {
        let res = await this.request(`auth/register`, data, "post");
        return res.token;
    }

    /** Get performance history for a strategy by id. */

    static async getStrategyPerformanceHistory(strategyId) {
        let res = await this.request(`strategyPerformanceHistory/${strategyId}`);
        return res.performanceHistory;
    }
}

export default StocktrendsApi;