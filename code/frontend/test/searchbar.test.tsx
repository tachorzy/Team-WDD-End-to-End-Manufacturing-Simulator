/**
 * @jest-environment jsdom
 */


import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import "@testing-library/jest-dom";
import Searchbar, { SearchProps } from "../components/home/searchbar/Searchbar.client";
import SearchModeTray from "../components/home/searchbar/SearchModeTray";

jest.mock("axios");

const onSearchMock = jest.fn();

const setQueryMadeMock = jest.fn();

const props: SearchProps = {
    onSearch: onSearchMock,
    setQueryMade: setQueryMadeMock,
};

describe("Searchbar", () => {
    test("should render with deafult values without error", () => {
        const { getByText } = render(
            <Searchbar {...props} />,
        );

        expect(getByText("Create facility")).toBeInTheDocument();
    });

    test("should handle coordinates search correctly", async () => {
        const { getByText, getByPlaceholderText } = render(
            <Searchbar {...props} />,
        );

        fireEvent.click(getByText("Coordinates"));

        const searchButton = getByText("Create facility");
        const latitudeInput = getByPlaceholderText("Enter latitude");
        const longitudeInput = getByPlaceholderText("Enter longitude");

        fireEvent.change(latitudeInput, { target: { value: "40.7128" } });
        fireEvent.change(longitudeInput, { target: { value: "-74.006" } });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(onSearchMock).toHaveBeenCalledWith({
                lat: 40.7128,
                lon: -74.006,
            });
        });
    });

    test("should display error for invalid coordinates", async () => {
        const { getByText, getByPlaceholderText } = render(
            <Searchbar {...props} />,
        );

        // Switch to coordinates search
        fireEvent.click(getByText("Coordinates"));

        const searchButton = getByText("Create facility");
        const latitudeInput = getByPlaceholderText("Enter latitude");
        const longitudeInput = getByPlaceholderText("Enter longitude");

        fireEvent.change(latitudeInput, { target: { value: "1000" } });
        fireEvent.change(longitudeInput, { target: { value: "2000" } });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(
                getByText(/Invalid latitude or longitude/),
            ).toBeInTheDocument();
        });
    });

    test("should handle address search correctly", async () => {
        (axios.get as jest.Mock).mockResolvedValue({
            data: [
                {
                    lat: 40.7128,
                    lon: -74.006,
                },
            ],
        });

        const { getByText, getByPlaceholderText } = render(
            <Searchbar {...props} />,
        );

        const searchButton = getByText("Create facility");
        const addressInput = getByPlaceholderText("Enter factory address");

        fireEvent.change(addressInput, { target: { value: "123 Main St" } });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(onSearchMock).toHaveBeenCalledWith({
                lat: 40.7128,
                lon: -74.006,
            });
        });
    });
});

describe("Search Mode Tray", () => {
    test("should switch to address search mode when Address button is clicked", () => {
        const { getByText } = render(
            <SearchModeTray
                isAddressSearchBarActive
                setIsAddressSearchBarActive={() => {}}
                setInvalidCoords={() => {}}
                setInvalidAddress={() => {}}
            />,
        );

        fireEvent.click(getByText("Address"));
    });

    test("should switch to coordinates search mode when Coordinates button is clicked", () => {
        const { getByText } = render(
            <SearchModeTray
                isAddressSearchBarActive
                setIsAddressSearchBarActive={() => {}}
                setInvalidCoords={() => {}}
                setInvalidAddress={() => {}}
            />,
        );

        fireEvent.click(getByText("Coordinates"));
    });
})
