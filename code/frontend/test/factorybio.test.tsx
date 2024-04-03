import React from "react";
import { render, waitFor } from "@testing-library/react";
import { Factory } from "@/app/types/types";
import fetchMock from "jest-fetch-mock";
import FactoryBio from "../components/factorydashboard/FactoryBio";
import "@testing-library/jest-dom";

fetchMock.enableMocks();

describe("Factorybio Component", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test("should render the Factorybio component", async () => {
        const mockFactory: Factory = {
            factoryId: "123456789",
            name: "New Factory",
            location: {
                latitude: 44.0544393,
                longitude: -123.0903921,
            },
            description: "This is a new factory",
        };

        fetchMock.mockResponseOnce(
            JSON.stringify({ data: { factory: mockFactory } }),
        );

        const mockFactoryId = "123456789";
        const { queryAllByText } = render(
            <FactoryBio factoryId={mockFactoryId} />,
        );

        await waitFor(() =>
            expect(queryAllByText("Loading...").length).toBeGreaterThan(0),
        );
    });

    test("should display 'Loading...' when factory data is not yet available", async () => {
        fetchMock.mockResponse(() => new Promise((resolve) => {}));

        const { findAllByText } = render(<FactoryBio factoryId="123456789" />);

        const loadingElements = await findAllByText("Loading...");
        expect(loadingElements).toBeTruthy();
    });

    test("should display factory data", async () => {
        const mockFactory: Factory = {
            factoryId: "123456789",
            name: "New Factory",
            location: {
                latitude: 44.0544393,
                longitude: -123.0903921,
            },
            description: "This is a new factory",
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockFactory));

        const { findByText } = render(
            <FactoryBio factoryId={mockFactory.factoryId as string} />,
        );

        const nameElement = await findByText(mockFactory.name);
        const locationElement = await findByText(
            `${Number(mockFactory.location.latitude).toFixed(2)}°, ${Number(mockFactory.location.longitude).toFixed(2)}°`,
        );
        const descriptionElement = await findByText(mockFactory.description);

        expect(nameElement).toBeInTheDocument();
        expect(locationElement).toBeInTheDocument();
        expect(descriptionElement).toBeInTheDocument();
    });

    test("should find factory's city and country by reverse geocode search", async () => {
        const mockFactory = {
            factoryId: "123456789",
            name: "New Factory",
            location: {
                latitude: 44.0544393,
                longitude: -123.0903921,
            },
            description: "This is a new factory",
        };

        const mockLocation = {
            address: {
                city: "Eugene",
                country: "United States",
                state: "Oregon",
            },
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockFactory));

        fetchMock.mockResponseOnce(JSON.stringify(mockLocation));

        const { findByText } = render(
            <FactoryBio factoryId={mockFactory.factoryId} />,
        );

        const civilLocationElement = await findByText(
            `${mockLocation.address.city}, ${mockLocation.address.state}, ${mockLocation.address.country}`,
        );

        expect(civilLocationElement).toBeInTheDocument();
    });

    test("should not display undefined city location", async () => {
        const mockFactory: Factory = {
            factoryId: "1111111",
            name: "New Factory",
            location: {
                latitude: 18.0,
                longitude: 76.0,
            },
            description: "These coordinates are in the middle of nowhere.",
        };

        const mockLocation = {
            address: {
                city: undefined,
                country: "India",
                state: "Maharashtra",
            },
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockFactory));

        fetchMock.mockResponseOnce(JSON.stringify(mockLocation));

        const { findByText } = render(
            <FactoryBio factoryId={mockFactory.factoryId as string} />,
        );

        const civilLocationElement = await findByText(
            `${mockLocation.address?.state}, ${mockLocation.address?.country}`,
        );

        expect(civilLocationElement).toBeInTheDocument();
    });

    test("should not display undefined city in location", async () => {
        const mockFactory: Factory = {
            factoryId: "1111111",
            name: "New Factory",
            location: {
                latitude: 18.0,
                longitude: 76.0,
            },
            description: "These coordinates are in the middle of nowhere.",
        };

        const mockLocation = {
            address: {
                city: undefined,
                country: "India",
                state: "Maharashtra",
            },
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockFactory));

        fetchMock.mockResponseOnce(JSON.stringify(mockLocation));

        const { findByText } = render(
            <FactoryBio factoryId={mockFactory.factoryId as string} />,
        );

        const civilLocationElement = await findByText(
            `${mockLocation.address?.state}, ${mockLocation.address?.country}`,
        );

        expect(civilLocationElement).toBeInTheDocument();
    });

    test("should not display undefined region in location", async () => {
        const mockFactory: Factory = {
            factoryId: "01010101010",
            name: "New Factory",
            location: {
                latitude: 1.3521,
                longitude: 103.8198,
            },
            description: "These coordinates are in the middle of nowhere.",
        };

        const mockLocation = {
            address: {
                city: "Singapore",
                country: "Singapore",
                state: undefined,
            },
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockFactory));

        fetchMock.mockResponseOnce(JSON.stringify(mockLocation));

        const { findByText } = render(
            <FactoryBio factoryId={mockFactory.factoryId as string} />,
        );

        const civilLocationElement = await findByText(
            `${mockLocation.address?.city}, ${mockLocation.address?.country}`,
        );

        expect(civilLocationElement).toBeInTheDocument();
    });

    test("should not display a city, region or country for offshore facilities", () => {
        const mockFactory: Factory = {
            factoryId: "123123123",
            name: "New Factory",
            location: {
                latitude: 0,
                longitude: 0,
            },
            description: "These coordinates are in the middle of nowhere.",
        };

        const mockLocation = {
            address: {
                city: undefined,
                country: undefined,
                state: undefined,
            },
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockFactory));

        fetchMock.mockResponseOnce(JSON.stringify(mockLocation));

        const { queryByText } = render(
            <FactoryBio factoryId={mockFactory.factoryId as string} />,
        );

        const civilLocationElement = queryByText(
            `${mockLocation.address?.city}, ${mockLocation.address?.state}, ${mockLocation.address?.country}`,
        );

        expect(civilLocationElement).not.toBeInTheDocument();
    });

    test("should display flag icon by ISO2 code of the facilities country", async () => {
        const mockFactory = {
            factoryId: "123456789",
            name: "New Factory",
            location: {
                latitude: 44.0544393,
                longitude: -123.0903921,
            },
            description: "This is a new factory",
        };

        const mockLocation = {
            address: {
                city: "Eugene",
                country: "United States",
                state: "Oregon",
                country_code: "us",
            },
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockFactory));

        fetchMock.mockResponseOnce(JSON.stringify(mockLocation));

        const { getByAltText } = render(
            <FactoryBio factoryId={mockFactory.factoryId} />,
        );

        await waitFor(() => {
            const flagIcon = getByAltText(
                `flag icon ${mockLocation.address.country_code}`,
            );
            expect(flagIcon).toBeInTheDocument();
        });
    });

    test("should display globe icon when a facility is not in a country", async () => {
        const mockFactory = {
            factoryId: "123456789",
            name: "New Factory",
            location: {
                latitude: 82.8628,
                longitude: 135.0,
            },
            description: "This factory is super cold",
        };

        const mockLocation = {
            address: {
                city: undefined,
                country: undefined,
                state: undefined,
                country_code: undefined,
            },
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockFactory));

        fetchMock.mockResponseOnce(JSON.stringify(mockLocation));

        const { getByAltText } = render(
            <FactoryBio factoryId={mockFactory.factoryId} />,
        );

        await waitFor(() => {
            const flagIcon = getByAltText("globe icon");
            expect(flagIcon).toBeInTheDocument();
        });
    });
});
