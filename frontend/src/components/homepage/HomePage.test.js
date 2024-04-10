import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Homepage from "./HomePage";

describe("Homepage", () => {
    it("renders correctly", () => {
        render(
            <BrowserRouter>
                <Homepage />
            </BrowserRouter>
        );

        expect(screen.getByText(/welcome to stocktrends/i)).toBeInTheDocument();
        expect(screen.getByText(/Stocktrends is your gateway to understanding and making the most out of the stock market./i)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /strategies/i })).toBeInTheDocument();
    });

    it("matches snapshot", () => {
        const { asFragment } = render(
            <BrowserRouter>
                <Homepage />
            </BrowserRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
