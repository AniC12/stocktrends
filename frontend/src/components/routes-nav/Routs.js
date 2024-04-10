import React from "react";
import { Routes, Route } from "react-router-dom";
import StrategyList from "../strategies/StrategyList";
import StrategyDetail from "../strategies/StrategyDetail";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import Homepage from "../homepage/HomePage";
import PortfolioList from "../portfolios/PortfolioList";
import PortfolioDetail from "../portfolios/PortfolioDetail";

function MyRoutes({ signup, login }) {

    return (
        <div className="pt-5">
            <Routes>
                <Route path="/" element={<Homepage />} />

                <Route path="/login" element={<LoginForm login={login} />} />

                <Route path="/signup" element={<SignupForm signup={signup} />} />

                <Route path="/strategies" element={<StrategyList />} />

                <Route path="/strategies/:id" element={<StrategyDetail />} />

                <Route path="/portfolios" element={<PortfolioList />} />

                <Route path="/portfolios/:id" element={<PortfolioDetail />} />

            </Routes>
        </div>
    );
}

export default MyRoutes;