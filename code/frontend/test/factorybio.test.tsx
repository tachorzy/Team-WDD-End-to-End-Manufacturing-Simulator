import React from "react";
import { render, waitFor } from "@testing-library/react";
import FactoryBio from "../components/factorydashboard/FactoryBio";
import { Factory } from "@/app/types/types";
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe("Factorybio Component", () => { 
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test("should render the Factorybio component", async () => {
        const mockFactory: Factory = 
            {
                factoryId: "123456789",
                name: "New Factory",
                location: {
                    longitude: 123.456,
                    latitude: 456.789,
                },
                description: "This is a new factory",
            };
        
        fetchMock.mockResponseOnce(JSON.stringify({ mockFactory }));

        const mockFactoryId = "123456789";
        const { queryAllByText } = render(
            <FactoryBio factoryId={mockFactoryId} />,
        );

        await waitFor(() => expect(queryAllByText("Loading...").length).toBeGreaterThan(0));
    });
});