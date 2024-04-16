import React from "react";
import L from "leaflet";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Factory } from "@/app/api/_utils/types";
import MapPin, { PinProps } from "../components/home/map/MapPin";

const fakeFactories: Factory[] = [
    {
        factoryId: "1",
        name: "Factory 1",
        description: "This is the first factory",
        location: { latitude: 1, longitude: 1 },
    },
    {
        factoryId: "2",
        name: "Factory 2",
        description: "This is the second factory",
        location: { latitude: 1, longitude: 1 },
    },
];

const icon = L.icon({
    iconUrl: "icons/map/factory-map-marker.svg",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
});

const props = {
    _key: 1,
    position: { lat: 1, lng: 1 },
    factoriesAtLocation: fakeFactories,
    icon,
};

jest.mock("react-leaflet", () => ({
    Marker: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="marker">{children}</div>
    ),
    Popup: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="popup">{children}</div>
    ),
}));

jest.mock("leaflet/dist/leaflet.css", () => {});

describe("MapPin component", () => {
    test("renders MapPin without errors", () => {
        render(<MapPin {...props} />);
    });

    test("Displays the details of a single factory at a location in a popup", () => {
        const newProps: PinProps = {
            ...props,
            factoriesAtLocation: [fakeFactories[0]],
        };

        const { getByTestId } = render(<MapPin {...newProps} />);

        const firstFactory = newProps.factoriesAtLocation[0];
        expect(getByTestId("popup")).toHaveTextContent(
            `${firstFactory.name}${firstFactory.location.latitude.toFixed(2)}°, ${firstFactory.location.longitude.toFixed(2)}°${firstFactory.description}View Factory›`,
        );
    });

    test("Next button correctly renders the next page of a location", () => {
        const { getByTestId, getByText } = render(<MapPin {...props} />);

        expect(getByTestId("popup")).toHaveTextContent(fakeFactories[0].name);

        const nextButton = getByText("Next");
        fireEvent.click(nextButton);

        expect(getByTestId("popup")).toHaveTextContent(fakeFactories[1].name);
    });

    test("Previous button correctly renders the next page of a location", () => {
        const { getByTestId, getByText } = render(<MapPin {...props} />);

        expect(getByTestId("popup")).toHaveTextContent(fakeFactories[0].name);

        const nextButton = getByText("Next");
        fireEvent.click(nextButton);

        expect(getByTestId("popup")).toHaveTextContent(fakeFactories[1].name);

        const prevButton = getByText("Previous");
        fireEvent.click(prevButton);

        expect(getByTestId("popup")).toHaveTextContent(fakeFactories[0].name);
    });

    test("Next and Previous buttons are disabled appropriately", () => {
        const { getByText } = render(<MapPin {...props} />);

        const previousButton = getByText("Previous");
        expect(previousButton).toBeDisabled();

        const nextButton = getByText("Next");
        fakeFactories.forEach(() => {
            fireEvent.click(nextButton);
        });

        expect(nextButton).toBeDisabled();
    });

    test("Displays the details of a all factories at a marker's location", () => {
        const newProps: PinProps = {
            ...props,
            factoriesAtLocation: fakeFactories,
        };

        const { getByTestId, getByText } = render(<MapPin {...newProps} />);

        const firstFactory = newProps.factoriesAtLocation[0];
        expect(getByTestId("popup")).toHaveTextContent(
            `${firstFactory.name}${firstFactory.location.latitude.toFixed(2)}°, ${firstFactory.location.longitude.toFixed(2)}°${firstFactory.description}View Factory›‹Previous1Next›`,
        );
        const nextButton = getByText("Next");
        fireEvent.click(nextButton);

        const secondFactory = newProps.factoriesAtLocation[1];
        expect(getByTestId("popup")).toHaveTextContent(
            `${secondFactory.name}${secondFactory.location.latitude.toFixed(2)}°, ${secondFactory.location.longitude.toFixed(2)}°${secondFactory.description}View Factory›‹Previous2Next›`,
        );
    });

    test("should display 'No description' when a factory has no description", () => {
        const newProps: PinProps = {
            ...props,
            factoriesAtLocation: [{ ...fakeFactories[0], description: "" }],
        };

        const { getByTestId } = render(<MapPin {...newProps} />);

        expect(getByTestId("popup")).toHaveTextContent("No description.");
    });
});
