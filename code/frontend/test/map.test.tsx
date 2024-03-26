/**
 * @jest-environment jsdom
 */
import React from "react";
import { render } from "@testing-library/react";
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
    test("renders without error", () => {
        render(<MapComponent positions={mockFactories}/>);
    });
});