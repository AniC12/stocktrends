import React from "react";
import { Routes, Route } from "react-router-dom";
import StrategyList from "../strategies/StrategyList";
import StrategyDetail from "../strategies/StrategyDetail";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import Homepage from "../homepage/HomePage";

function MyRoutes({ signup, login }) {

    return (
        <div className="pt-5">
            <Routes>
                <Route exact path="/">
                    <Homepage />
                </Route>

                <Route exact path="/login">
                    <LoginForm login={login} />
                </Route>

                <Route exact path="/signup">
                    <SignupForm signup={signup} />
                </Route>

                <Route exact path="/strategies">
                    <StrategyList />
                </Route>

                <Route exact path="/strategies/:id">
                    <StrategyDetail />
                </Route>

            </Routes>
        </div>
    );
}

export default MyRoutes;