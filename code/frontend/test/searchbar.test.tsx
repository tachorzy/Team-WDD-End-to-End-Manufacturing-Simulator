/**
 * @jest-environment jsdom
 */

/*
  TODO:
    Searchbar should handle address search correctly using global.fetch instead of axios
*/

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import "@testing-library/jest-dom";
import SearchModeTray from "../components/home/searchbar/SearchModeTray";

jest.mock("axios");
jest.mock("@/app/api/factories/factoryAPI");

describe("Searchbar Component", () => {
    test("should render the Searchbar component", () => {
        const { getByText } = render(
            <Searchbar onSearch={() => {}} setQueryMade={() => {}} />,
        );

        expect(getByText("Create facility")).toBeInTheDocument();
    });

    test("should handle coordinates search correctly", async () => {
        const onSearchMock = jest.fn();
        const { getByText, getByPlaceholderText } = render(
            <Searchbar onSearch={onSearchMock} setQueryMade={() => {}} />,
        );

        // Switch to coordinates search
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
            <Searchbar onSearch={() => {}} setQueryMade={() => {}} />,
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

    // Test cases for SearchModeTray
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

    test("should handle address search correctly", async () => {
        const onSearchMock = jest.fn();
        (axios.get as jest.Mock).mockResolvedValue({
            data: [
                {
                    lat: 40.7128,
                    lon: -74.006,
                },
            ],
        });

        const { getByText, getByPlaceholderText } = render(
            <Searchbar onSearch={onSearchMock} setQueryMade={() => {}} />,
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
