/**
 * @jest-environment jsdom
 */
import React from "react";
import { render } from "@testing-library/react";
import MapComponent from "../components/home/map/Map.client";

jest.mock("react-leaflet", () => ({
    MapContainer: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mapcontainer">{children}</div>
    ),
    TileLayer: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="tilelayer">{children}</div>
    ),
    // useMap: ({ children }: { children: React.ReactNode }) => (
    //     <div data-testid="usemap">{children}</div>
    // )
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
    test("redners without error", () => {
        render(<MapComponent positions={mockFactories}/>);
    });
});