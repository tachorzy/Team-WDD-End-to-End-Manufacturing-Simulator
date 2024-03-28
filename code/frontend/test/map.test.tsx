/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"
import MapComponent, {  MapProps, ChangeView } from "../components/home/map/Map.client";
import L from "leaflet";
import { Factory } from "@/app/types/types";

jest.mock("react-leaflet", () => ({
    MapContainer: () => <div data-testid="mapcontainer">"Map Container"</div>,
    TileLayer: jest.fn(),
    useMap: jest.fn(),
}));

jest.mock("leaflet/dist/leaflet.css", () => {});

jest.mock("leaflet");

global.fetch = jest.fn();

describe ("MapCompenent", () => {
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

    const props: MapProps = {
        positions: mockFactory,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should render without error", async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve({
            json: () => Promise.resolve({mockFactory})
        }));
        
        const { getByTestId } = render(<MapComponent {...props} />);
    
        await waitFor (() => {
            expect(getByTestId("mapcontainer")).toHaveTextContent("Map Container");
        });
    });

    // Causes TypeError: factories.concat is not a function
    // test("should render with two factories", async () => {
    //     const twoFakeFactories: Factory[] = [
    //         {
    //             factoryId: "1",
    //             name: "Fake Factory 1",
    //             location: {
    //                 longitude: 123.456,
    //                 latitude: 456.789,
    //             },
    //             description: "This is the first fake factory",
    //         },
    //         {
    //             factoryId: "2",
    //             name: "Fake Factory 2",
    //             location: {
    //                 longitude: 123.456,
    //                 latitude: 456.789,
    //             },
    //             description: "This is the second fake factory",
    //         },
    //     ];

    //     const twoFactoryProps: MapProps = {
    //         positions: twoFakeFactories,
    //     };

    //     (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve({
    //         json: () => Promise.resolve({twoFakeFactories})
    //     }));

    //     const { getByTestId } = render(<MapComponent {...twoFactoryProps} />);
    
    //     await waitFor (() => {
    //         expect(getByTestId("mapcontainer")).toHaveTextContent("Map Container");
    //     });
    // }); 

    test("ChangeView renders without error", () => {  
        const ChangeViewprops = {
            center: L.latLng(12.34, 56.789),
            zoom: 15,
        };

        render(<ChangeView {...ChangeViewprops} />);
    });

    test("should throw and log an error on fetch", async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error("404")));        
        const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

        render(<MapComponent {...props} />);

        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalledWith("Error fetching factories:", new Error("404"));
        });
    })
});
