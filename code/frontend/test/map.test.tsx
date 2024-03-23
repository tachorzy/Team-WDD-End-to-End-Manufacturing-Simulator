import React from "react";
import L from "leaflet";
import { render, screen, fireEvent } from "@testing-library/react";
import MapComponent from "@/components/home/Map.client";

jest.mock("react-leaflet", () => ({
    MapContainer: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="map-container">{children}</div>
    ),
    TileLayer: () => <div data-testid="tile-layer" />,
    Marker: () => <div data-testid="marker" />,
}));

describe("Map Component", () => {
    test("renders without crashing", () => {
        const mockFactories = [
            {
                factoryId: "1",
                name: "Factory 1",
                location: { latitude: 40.7128, longitude: -74.006 },
                description: "Factory 1 description",
            },
            // Add more factories as needed for testing
        ];

        render(<MapComponent positions={mockFactories} />);

        // Check if MapContainer, TileLayer, and Marker are in the document
        expect(screen.getByTestId("map-container")).toBeInTheDocument();
        expect(screen.getByTestId("tile-layer")).toBeInTheDocument();
        expect(screen.getByTestId("marker")).toBeInTheDocument();
    });
});
