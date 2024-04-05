/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import L from "leaflet";
import { Factory } from "@/app/api/_utils/types";

import MapComponent, { ChangeView } from "../components/home/map/Map.client";

jest.mock("react-leaflet", () => ({
    MapContainer: () => <div data-testid="mapcontainer">"Map Container"</div>,
    TileLayer: jest.fn(),
    useMap: jest.fn(),
}));

jest.mock("leaflet/dist/leaflet.css", () => {});

jest.mock("leaflet");

global.fetch = jest.fn();

describe("MapCompenent", () => {
    const mockFactory: Factory[] = [
        {
            name: "New Factory",
            location: {
                longitude: 123.456,
                latitude: 456.789,
            },
            description: "This is a new factory",
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should render without error", async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({ mockFactory }),
            }),
        );

        const { getByTestId } = render(
            <MapComponent positions={mockFactory} />,
        );

        await waitFor(() => {
            expect(getByTestId("mapcontainer")).toHaveTextContent(
                "Map Container",
            );
        });
    });

    test("should render with two factories at the same location", async () => {
        const twoFakeFactories: Factory[] = [
            {
                factoryId: "1",
                name: "Fake Factory 1",
                location: {
                    longitude: 123.456,
                    latitude: 456.789,
                },
                description: "This is the first fake factory",
            },
            {
                factoryId: "2",
                name: "Fake Factory 2",
                location: {
                    longitude: 123.456,
                    latitude: 456.789,
                },
                description: "This is the second fake factory",
            },
        ];

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({ twoFakeFactories }),
            }),
        );

        const { getByTestId, unmount } = render(
            <MapComponent positions={twoFakeFactories} />,
        );

        await waitFor(() => {
            expect(getByTestId("mapcontainer")).toHaveTextContent(
                "Map Container",
            );
            unmount();
        });
    });

    test("should render with three factories at the same location", async () => {
        const threeFakeFactories: Factory[] = [
            {
                factoryId: "1",
                name: "Fake Factory 1",
                location: {
                    longitude: 123.456,
                    latitude: 456.789,
                },
                description: "This is the first fake factory",
            },
            {
                factoryId: "2",
                name: "Fake Factory 2",
                location: {
                    longitude: 123.456,
                    latitude: 456.789,
                },
                description: "This is the second fake factory",
            },
            {
                factoryId: "3",
                name: "Fake Factory 3",
                location: {
                    longitude: 123.456,
                    latitude: 456.789,
                },
                description: "This is the third fake factory",
            },
        ];

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({ threeFakeFactories }),
            }),
        );

        const { getByTestId, unmount } = render(
            <MapComponent positions={threeFakeFactories} />,
        );

        await waitFor(() => {
            expect(getByTestId("mapcontainer")).toHaveTextContent(
                "Map Container",
            );
            unmount();
        });
    });

    test("should render with four factories at the same location", async () => {
        const fourFakeFactories: Factory[] = [
            {
                factoryId: "1",
                name: "Fake Factory 1",
                location: {
                    longitude: 123.456,
                    latitude: 456.789,
                },
                description: "This is the first fake factory",
            },
            {
                factoryId: "2",
                name: "Fake Factory 2",
                location: {
                    longitude: 123.456,
                    latitude: 456.789,
                },
                description: "This is the second fake factory",
            },
            {
                factoryId: "3",
                name: "Fake Factory 3",
                location: {
                    longitude: 123.456,
                    latitude: 456.789,
                },
                description: "This is the third fake factory",
            },
            {
                factoryId: "4",
                name: "Fake Factory 4",
                location: {
                    longitude: 123.456,
                    latitude: 456.789,
                },
                description: "This is the fourth fake factory",
            },
        ];

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({ fourFakeFactories }),
            }),
        );

        const { getByTestId, unmount } = render(
            <MapComponent positions={fourFakeFactories} />,
        );

        await waitFor(() => {
            expect(getByTestId("mapcontainer")).toHaveTextContent(
                "Map Container",
            );
            unmount();
        });
    });

    test("should render with two factories at the different locations", async () => {
        const twoDifferentFactories: Factory[] = [
            {
                factoryId: "1",
                name: "Fake Factory 1",
                location: {
                    longitude: 123.456,
                    latitude: 456.789,
                },
                description: "This is the first fake factory",
            },
            {
                factoryId: "2",
                name: "Fake Factory 2",
                location: {
                    longitude: 456.789,
                    latitude: 123.456,
                },
                description: "This is the second fake factory",
            },
        ];

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({ twoDifferentFactories }),
            }),
        );

        const { getByTestId, unmount } = render(
            <MapComponent positions={twoDifferentFactories} />,
        );

        await waitFor(() => {
            expect(getByTestId("mapcontainer")).toHaveTextContent(
                "Map Container",
            );
            unmount();
        });
    });

    test("should render with three factories at the different locations", async () => {
        const threeDifferentFactories: Factory[] = [
            {
                factoryId: "1",
                name: "Fake Factory 1",
                location: {
                    longitude: 123.456,
                    latitude: 456.789,
                },
                description: "This is the first fake factory",
            },
            {
                factoryId: "2",
                name: "Fake Factory 2",
                location: {
                    longitude: 456.789,
                    latitude: 123.456,
                },
                description: "This is the second fake factory",
            },
            {
                factoryId: "3",
                name: "Fake Factory 2",
                location: {
                    longitude: 654.321,
                    latitude: 987.654,
                },
                description: "This is the third fake factory",
            },
        ];

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({ threeDifferentFactories }),
            }),
        );

        const { getByTestId, unmount } = render(
            <MapComponent positions={threeDifferentFactories} />,
        );

        await waitFor(() => {
            expect(getByTestId("mapcontainer")).toHaveTextContent(
                "Map Container",
            );
            unmount();
        });
    });

    test("should render with one factory at a different location and two factories at the same", async () => {
        const oneDifferentTwoSame: Factory[] = [
            {
                factoryId: "1",
                name: "Fake Factory 1",
                location: {
                    longitude: 123.456,
                    latitude: 456.789,
                },
                description: "This is the first fake factory",
            },
            {
                factoryId: "2",
                name: "Fake Factory 2",
                location: {
                    longitude: 456.789,
                    latitude: 123.456,
                },
                description: "This is the second fake factory",
            },
            {
                factoryId: "3",
                name: "Fake Factory 2",
                location: {
                    longitude: 456.789,
                    latitude: 123.456,
                },
                description: "This is the third fake factory",
            },
        ];

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({ oneDifferentTwoSame }),
            }),
        );

        const { getByTestId, unmount } = render(
            <MapComponent positions={oneDifferentTwoSame} />,
        );

        await waitFor(() => {
            expect(getByTestId("mapcontainer")).toHaveTextContent(
                "Map Container",
            );
            unmount();
        });
    });

    test("should render with two factories at a different location and two factories at the same", async () => {
        const twoDifferentTwoSame: Factory[] = [
            {
                factoryId: "1",
                name: "Fake Factory 1",
                location: {
                    longitude: 123.456,
                    latitude: 456.789,
                },
                description: "This is the first fake factory",
            },
            {
                factoryId: "2",
                name: "Fake Factory 2",
                location: {
                    longitude: 123.456,
                    latitude: 456.789,
                },
                description: "This is the second fake factory",
            },
            {
                factoryId: "3",
                name: "Fake Factory 3",
                location: {
                    longitude: 456.789,
                    latitude: 123.456,
                },
                description: "This is the third fake factory",
            },
            {
                factoryId: "4",
                name: "Fake Factory 4",
                location: {
                    longitude: 456.789,
                    latitude: 123.456,
                },
                description: "This is the fourth fake factory",
            },
        ];

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({ twoDifferentTwoSame }),
            }),
        );

        const { getByTestId, unmount } = render(
            <MapComponent positions={twoDifferentTwoSame} />,
        );

        await waitFor(() => {
            expect(getByTestId("mapcontainer")).toHaveTextContent(
                "Map Container",
            );
            unmount();
        });
    });

    test("ChangeView renders without error", () => {
        const ChangeViewprops = {
            center: L.latLng(12.34, 56.789),
            zoom: 15,
        };

        render(<ChangeView {...ChangeViewprops} />);
    });

    test("should throw and log an error on fetch", async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.reject(new Error("404")),
        );
        const consoleErrorMock = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        render(<MapComponent positions={mockFactory} />);

        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalledWith(
                "Error fetching factories:",
                new Error("404"),
            );
        });
    });
});
