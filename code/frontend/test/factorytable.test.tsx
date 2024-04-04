/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { Factory } from "@/app/api/_utils/types";
import { NextServerConnector, GetConfig } from "@/app/api/_utils/connector";
import FactoryTable from "../components/home/table/FactoryTable.client";
import Caret from "../components/home/table/Caret";

jest.mock("@/app/api/_utils/connector", () => ({
    NextServerConnector: {
        get: jest.fn(),
    },
}));

const consoleErrorMock = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

describe("FactoryTable", () => {
    beforeEach(() => {
        (NextServerConnector.get as jest.Mock).mockClear();
    });

    const mockFactories: Factory[] = [
        {
            factoryId: "1",
            name: "Factory 1",
            location: {
                latitude: 100.001,
                longitude: 200.002,
            },
            description: "This is factory 1",
        },
        {
            factoryId: "2",
            name: "Factory 2",
            location: {
                latitude: 300.003,
                longitude: 400.004,
            },
            description: "This is factory 2",
        },
        {
            factoryId: "3",
            name: "Factory 3",
            location: {
                latitude: 500.005,
                longitude: 600.006,
            },
            description: "This is factory 3",
        },
        {
            factoryId: "4",
            name: "Factory 4",
            location: {
                latitude: 700.007,
                longitude: 800.008,
            },
            description: "This is factory 4",
        },
    ];

    test("should render without error and with default values", () => {
        const { getAllByRole } = render(<FactoryTable />);

        const headers = getAllByRole("columnheader");
        const cell = getAllByRole("cell");

        expect(headers).toHaveLength(4);
        expect(headers[0]).toHaveTextContent("Facility Name");
        expect(headers[1]).toHaveTextContent("Latitude");
        expect(headers[2]).toHaveTextContent("Longitude");
        expect(headers[3]).toHaveTextContent("Description");
        expect(cell).toHaveLength(1);
        expect(cell[0]).toHaveTextContent("No Facilities Found");
    });

    test.each([
        [mockFactories.slice(0, 1)],
        [mockFactories.slice(0, 2)],
        [mockFactories.slice(0, 3)],
        [mockFactories],
    ])("should display the correct table values for %O", async (factories) => {
        const mockResponse = factories;

        (NextServerConnector.get as jest.Mock).mockImplementationOnce(
            ({ resource, params }: GetConfig) => mockResponse,
        );

        const { getByText, getAllByRole } = render(<FactoryTable />);

        await waitFor(() => {
            const cells = getAllByRole("cell");

            expect(cells).toHaveLength(factories.length * 4);

            factories.forEach((factory) => {
                expect(getByText(factory.name)).toBeInTheDocument();
                expect(
                    getByText(factory.location.latitude.toString()),
                ).toBeInTheDocument();
                expect(
                    getByText(factory.location.longitude.toString()),
                ).toBeInTheDocument();
                expect(getByText(factory.description)).toBeInTheDocument();
            });
        });
    });

    test("should display an empty string if any value is undefined", async () => {
        const mockResponse = [
            {
                ...mockFactories[0],
                name: undefined,
                location: {
                    latitude: undefined,
                    longitude: undefined,
                },
                description: undefined,
            },
        ];

        (NextServerConnector.get as jest.Mock).mockImplementationOnce(
            ({ resource, params }: GetConfig) => mockResponse,
        );

        const { getAllByRole } = render(<FactoryTable />);

        await waitFor(() => {
            const cells = getAllByRole("cell");

            cells.forEach((cell) => {
                expect(cell).toHaveTextContent("");
            });
        });
    });

    test("should log an error on fetch", async () => {
        (NextServerConnector.get as jest.Mock).mockImplementationOnce(
            ({ resource, params }: GetConfig) => {
                throw new Error("Fetch error");
            },
        );

        render(<FactoryTable />);

        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalled();
        });
    });

    test("should displays View all link and navigates correctly", () => {
        const { getByRole } = render(<FactoryTable />);

        const viewAllLink = getByRole("link", { name: /View all/i });

        expect(viewAllLink).toBeInTheDocument();
        expect(viewAllLink).toHaveAttribute("href", "/");
    });

    test("should display sorting arrow asc on first click", () => {
        const { getByText } = render(<FactoryTable />);

        fireEvent.click(getByText("Facility Name"));

        const caretSvgs = document.querySelectorAll("svg");

        expect(caretSvgs).toHaveLength(4);
        caretSvgs.forEach((caretSvg) =>
            expect(caretSvg).not.toHaveClass("transform rotate-180"),
        );
    });

    test("should display sorting arrow desc after second click", () => {
        const { getByText } = render(<FactoryTable />);

        fireEvent.click(getByText("Facility Name"));
        fireEvent.click(getByText("Facility Name"));

        const caretSvgs = document.querySelectorAll("svg");

        expect(caretSvgs).toHaveLength(4);
        caretSvgs.forEach((caretSvg) =>
            expect(caretSvg).toHaveClass("transform rotate-180"),
        );
    });
});

describe("Caret", () => {
    test("should render with correct direction", () => {
        const { getByTestId } = render(<Caret direction="desc" />);
        const caretSvg = getByTestId("caret");
        expect(caretSvg).toHaveClass("transform rotate-180");
    });

    test("should render without rotation for opposite direction", () => {
        const { getByTestId } = render(<Caret direction="asc" />);
        const caretSvg = getByTestId("caret");
        expect(caretSvg).not.toHaveClass("transform rotate-180");
    });
});
