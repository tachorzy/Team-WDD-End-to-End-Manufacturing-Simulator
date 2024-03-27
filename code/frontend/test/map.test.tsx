/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, waitFor } from "@testing-library/react";
import MapComponent from "../components/home/map/Map.client";

jest.mock("react-leaflet", () => ({
    MapContainer: jest.fn(),
    TileLayer: jest.fn(),
    useMap: jest.fn()
}));

jest.mock("leaflet/dist/leaflet.css", () => {});

const mockFactories = [
    {
        factoryId: "1",
        name: "Factory 1",
        location: {
            longitude: 123.456,
            latitude: 456.789
        },
        description: "This is the first factory",
    },
];

describe ("MapCompenent", () => {
    beforeEach(() => {
        global.fetch = jest.fn(() => 
            Promise.resolve({  
                json: () => Promise.resolve(
                    {
                        mockFactories,
                    },
                ),
            })
        ) as jest.Mock;
    });

    afterEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });

    test("renders without error", () => {
        render(<MapComponent positions={mockFactories}/>);
    });

    test("error occurs on fetch", async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error("404")));        
        const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

        render(<MapComponent positions={mockFactories} />);

        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalledWith("Error fetching factories:", new Error("404"));
        });
    })
});