import React from "react";
import L from "leaflet";
import { render, screen } from "@testing-library/react";
import { Factory } from "@/app/types/types";
import MapPin, { PinProps } from "../components/home/map/MapPin";
import { groupFactoriesByLocation } from "../components/home/Map.client";
import { fireEvent } from '@testing-library/react';

import "@testing-library/jest-dom";

const fakeFactories = [
    {
        factoryId: "1",
        name: "Factory 1",
        lat: 123.456,
        lon: 456.789,
        description: "This is the first factory",
        location: {
            latitude: 123.456,
            longitude: 456.789,
        },
    },
    {
        factoryId: "2",
        name: "Factory 2",
        lat: 234.567,
        lon: 567.89,
        description: "This is the second factory",
        location: {
            latitude: 234.567,
            longitude: 567.89,
        },
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

    test("groupFactoriesByLocation groups factories correctly", () => {
        const fakeFactoryArray: Factory[] = [
            {
                factoryId: "1",
                name: "Factory 1",
                location: { latitude: 1, longitude: 1 },
                description: "This is the first factory",
            },
            {
                factoryId: "2",
                name: "Factory 2",
                location: { latitude: 1, longitude: 1 },
                description: "This is the second factory",
            },
            {
                factoryId: "3",
                name: "Factory 3",
                location: { latitude: 2, longitude: 2 },
                description: "This is the third factory",
            },
        ];
        const groupedFactories = groupFactoriesByLocation(fakeFactoryArray);
        expect(Object.keys(groupedFactories)).toHaveLength(2);
    });

    test("Displays the details of a single factory at a location in a popup", () => {
        const factoriesAtLocation = [
            {
                factoryId: "1",
                name: "Factory 1",
                description: "This is the first factory",
                location: { latitude: 1, longitude: 1 },
            },
        ];
        const newProps: PinProps = {
            _key: 1234,
            position: { lat: 1, lng: 1 },
            factoriesAtLocation,
            icon,
        };
        render(<MapPin {...newProps} />);
        const firstFactory = factoriesAtLocation[0];
        expect(screen.getByTestId("popup")).toHaveTextContent(
            `${firstFactory.name}${firstFactory.location.latitude.toFixed(2)}°, ${firstFactory.location.longitude.toFixed(2)}°${firstFactory.description}View Factory›`,
        );
    });

    test('Next button correctly renders the next page of a location', () => {
        const factoriesAtLocation = [
          { factoryId: '1', name: 'Factory 1', description: 'This is the first factory', location: { latitude: 1, longitude: 1 } },
          { factoryId: '2', name: 'Factory 2', description: 'This is the second factory', location: { latitude: 1, longitude: 1 } },
        ];

        const newProps: PinProps = {
          _key: 1234,
          position: { lat: 1, lng: 1 },
          factoriesAtLocation: factoriesAtLocation,
          icon: icon 
        };
        
        render(<MapPin {...newProps} />);
        
        expect(screen.getByTestId('popup')).toHaveTextContent(factoriesAtLocation[0].name);
        
        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);
        
        expect(screen.getByTestId('popup')).toHaveTextContent(factoriesAtLocation[1].name);
    });

    test('Previous button correctly renders the next page of a location', () => {
        const factoriesAtLocation = [
          { factoryId: '1', name: 'Factory 1', description: 'This is the first factory', location: { latitude: 1, longitude: 1 } },
          { factoryId: '2', name: 'Factory 2', description: 'This is the second factory', location: { latitude: 1, longitude: 1 } },
        ];

        const newProps: PinProps = {
          _key: 1234,
          position: { lat: 1, lng: 1 },
          factoriesAtLocation: factoriesAtLocation,
          icon: icon 
        };
        
        render(<MapPin {...newProps} />);
        
        expect(screen.getByTestId('popup')).toHaveTextContent(factoriesAtLocation[0].name);

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(screen.getByTestId('popup')).toHaveTextContent(factoriesAtLocation[1].name);
        
        const prevButton = screen.getByText('Previous');
        fireEvent.click(prevButton);
        
        expect(screen.getByTestId('popup')).toHaveTextContent(factoriesAtLocation[0].name);
    });

    test('Next and Previous buttons are disabled appropriately', () => {
        render(<MapPin {...props} />);
      
        const previousButton = screen.getByText('Previous');
        expect(previousButton).toBeDisabled();
      
        const nextButton = screen.getByText('Next');
        for (let i = 0; i < fakeFactories.length - 1; i++) {
          fireEvent.click(nextButton);
        }
      
        expect(nextButton).toBeDisabled();
      });

    test('Displays the details of a all factories at a marker\'s location', () => {
        const factoriesAtLocation = [
          { factoryId: '1', name: 'Factory 1', description: 'This is the first factory', location: { latitude: 1, longitude: 1 } },
          { factoryId: '2', name: 'Factory 2', description: 'This is the second factory', location: { latitude: 1, longitude: 1 } },
        ];

        const newProps: PinProps = {
          _key: 1234,
          position: { lat: 1, lng: 1 },
          factoriesAtLocation: factoriesAtLocation,
          icon: icon 
        };
        
        render(<MapPin {...newProps} />);
        
        const firstFactory = factoriesAtLocation[0];
        expect(screen.getByTestId("popup")).toHaveTextContent(
            `${firstFactory.name}${firstFactory.location.latitude.toFixed(2)}°, ${firstFactory.location.longitude.toFixed(2)}°${firstFactory.description}View Factory›‹Previous1Next›`,
        );        
        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);
        
        const secondFactory = factoriesAtLocation[1];
        expect(screen.getByTestId("popup")).toHaveTextContent(
            `${secondFactory.name}${secondFactory.location.latitude.toFixed(2)}°, ${secondFactory.location.longitude.toFixed(2)}°${secondFactory.description}View Factory›‹Previous2Next›`,
        );    });

});
