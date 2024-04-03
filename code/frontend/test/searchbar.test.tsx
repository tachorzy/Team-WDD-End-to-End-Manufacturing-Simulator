/** mockAxios
 * @jest-environment jsdom
 */
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import "@testing-library/jest-dom";
import Searchbar, {
    SearchProps,
} from "../components/home/searchbar/Searchbar.client";
import SearchModeTray from "../components/home/searchbar/SearchModeTray";

jest.mock("axios");

const onSearchMock = jest.fn();
const setQueryMadeMock = jest.fn();

const props: SearchProps = {
    onSearch: onSearchMock,
    setQueryMade: setQueryMadeMock,
};

describe("Searchbar", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should render with deafult values without error", () => {
        const { getByText, getByPlaceholderText, getByAltText } = render(
            <Searchbar {...props} />,
        );

        expect(
            getByPlaceholderText("Enter factory address"),
        ).toBeInTheDocument();
        expect(getByPlaceholderText("Enter factory address")).toHaveValue("");
        expect(getByText("Create facility")).toBeInTheDocument();
        expect(getByAltText("maginify glass")).toBeInTheDocument();
    });

    test("should render with coordinates mode wihtout error", () => {
        const { getByText, getByPlaceholderText, getByAltText } = render(
            <Searchbar {...props} />,
        );

        fireEvent.click(getByText("Coordinates"));

        expect(getByPlaceholderText("Enter latitude")).toBeInTheDocument();
        expect(getByPlaceholderText("Enter latitude")).toHaveValue("");
        expect(getByPlaceholderText("Enter longitude")).toBeInTheDocument();
        expect(getByPlaceholderText("Enter longitude")).toHaveValue("");
        expect(getByText("Create facility")).toBeInTheDocument();
        expect(getByAltText("maginify glass")).toBeInTheDocument();
    });

    test("should handle address search correctly", async () => {
        const coords = {
            lat: 12.345,
            lon: 67.89,
        };
        const address = "123 Main St";

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: [coords] });

        const { getByText, getByPlaceholderText } = render(
            <Searchbar {...props} />,
        );

        const addressInput = getByPlaceholderText("Enter factory address");
        const searchButton = getByText("Create facility");

        fireEvent.change(addressInput, { target: { value: address } });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(onSearchMock).toHaveBeenCalledWith(coords);
            expect(setQueryMadeMock).toHaveBeenCalledWith(true);
        });
    });

    test("should display error message on invalid address", async () => {
        const responseData = "Could not find coordinates";
        const address = "-99 Invalid Address Blvd";

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: responseData });

        const { getByText, getByPlaceholderText, getByAltText } = render(
            <Searchbar {...props} />,
        );

        const addressInput = getByPlaceholderText("Enter factory address");
        const searchButton = getByText("Create facility");

        fireEvent.change(addressInput, { target: { value: address } });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(
                getByText(
                    "We couldn't find the address that you're looking for. Please try again.",
                ),
            ).toBeInTheDocument();
            expect(getByAltText("error pin")).toBeInTheDocument();
            expect(onSearchMock).not.toHaveBeenCalled();
            expect(setQueryMadeMock).not.toHaveBeenCalled();
        });
    });

    test("should catch error on axios.get", async () => {
        const address = "404 Error Rd";

        (axios.get as jest.Mock).mockRejectedValue(
            new Error("Failed getting coordinates"),
        );

        const { getByText, getByPlaceholderText } = render(
            <Searchbar {...props} />,
        );

        const addressInput = getByPlaceholderText("Enter factory address");
        const searchButton = getByText("Create facility");

        fireEvent.change(addressInput, { target: { value: address } });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(onSearchMock).not.toHaveBeenCalled();
            expect(setQueryMadeMock).not.toHaveBeenCalled();
        });
    });

    test("should handle coordinates search correctly", async () => {
        const coords = {
            lat: 12.345,
            lon: 67.89,
        };

        const { getByText, getByPlaceholderText } = render(
            <Searchbar {...props} />,
        );

        fireEvent.click(getByText("Coordinates"));

        const searchButton = getByText("Create facility");
        const latitudeInput = getByPlaceholderText("Enter latitude");
        const longitudeInput = getByPlaceholderText("Enter longitude");

        fireEvent.change(latitudeInput, {
            target: { value: coords.lat.toString() },
        });
        fireEvent.change(longitudeInput, {
            target: { value: coords.lon.toString() },
        });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(onSearchMock).toHaveBeenCalledWith(coords);
            expect(setQueryMadeMock).toHaveBeenCalledWith(true);
        });
    });

    test("should display error on invalid coordinates", async () => {
        const coords = {
            lat: 1000,
            lon: 2000,
        };

        const { getByText, getByPlaceholderText, getByAltText } = render(
            <Searchbar {...props} />,
        );

        fireEvent.click(getByText("Coordinates"));

        const searchButton = getByText("Create facility");
        const latitudeInput = getByPlaceholderText("Enter latitude");
        const longitudeInput = getByPlaceholderText("Enter longitude");

        fireEvent.change(latitudeInput, {
            target: { value: coords.lat.toString() },
        });
        fireEvent.change(longitudeInput, {
            target: { value: coords.lon.toString() },
        });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(
                getByText(
                    "Invalid latitude or longitude provided. Latitude must be between -90° and 90°. Longitude must be between -180° and 180°.",
                ),
            ).toBeInTheDocument();
            expect(getByAltText("error pin")).toBeInTheDocument();
            expect(onSearchMock).not.toHaveBeenCalled();
            expect(setQueryMadeMock).not.toHaveBeenCalled();
        });
    });
});

describe("Search Mode Tray", () => {
    test("should switch to address search mode when Address button is clicked", () => {
        const { getByText } = render(
            <SearchModeTray
                isAddressSearchBarActive
                setIsAddressSearchBarActive={jest.fn()}
                setInvalidCoords={jest.fn()}
                setInvalidAddress={jest.fn()}
            />,
        );

        fireEvent.click(getByText("Address"));
    });

    test("should switch to coordinates search mode when Coordinates button is clicked", () => {
        const { getByText } = render(
            <SearchModeTray
                isAddressSearchBarActive
                setIsAddressSearchBarActive={jest.fn()}
                setInvalidCoords={jest.fn()}
                setInvalidAddress={jest.fn()}
            />,
        );

        fireEvent.click(getByText("Coordinates"));
    });
});
