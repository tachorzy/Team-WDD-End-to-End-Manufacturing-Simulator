/**
 * @jest-environment jsdom
 */
import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { Factory } from "@/app/api/_utils/types";
import { NextServerConnector } from "@/app/api/_utils/connector";
import FactoryBio from "../components/factorydashboard/FactoryBio";
import "@testing-library/jest-dom";

jest.mock("@/app/api/_utils/connector", () => ({
    NextServerConnector: {
        get: jest.fn(),
    },
}));

global.fetch = jest.fn();

jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: any) => <img alt="" {...props} />,
}));

const mockEditFactoryForm = jest.fn();
jest.mock("../components/factorydashboard/editFactory", () => {
    const MockEditFactoryForm = (props: any) => {
        mockEditFactoryForm(props);
        return <div data-testid="edit-factory" />;
    };
    MockEditFactoryForm.displayName = "EditFactoryForm";
    return MockEditFactoryForm;
});

describe("Factorybio Component", () => {
    afterEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockClear();
    });

    const mockFactory: Factory = {
        factoryId: "1",
        name: "New Factory",
        location: {
            latitude: 123.45,
            longitude: -678.9,
        },
        description: "This is a new factory",
    };

    const mockAddress = {
        ISO: "",
        city: "",
        country: "",
        country_code: "",
        county: "",
        house_number: "",
        postcode: "",
        road: "",
        state: "",
    };

    test("should render without default values", async () => {
        const { getAllByText, getByAltText } = render(
            <FactoryBio factoryId="1" />,
        );

        await waitFor(() => {
            const loadingElements = getAllByText("Loading...");
            expect(loadingElements).toHaveLength(4);
            expect(getByAltText("edit icon")).toBeInTheDocument();
            expect(getByAltText("globe icon")).toBeInTheDocument();
        });
    });

    test.each([
        [
            {
                address: {
                    ...mockAddress,
                    city: "Houston",
                    state: "Texas",
                    country: "United States",
                },
            },
            /Houston, Texas, United States/,
        ],
        [
            {
                address: {
                    ...mockAddress,
                    city: "Houston",
                },
            },
            /Houston,/,
        ],
        [
            {
                address: {
                    ...mockAddress,
                    city: "Houston",
                    state: "Texas",
                },
            },
            /Houston, Texas,/,
        ],
    ])("should display civil location", async (location, expected) => {
        const consoleErrorMock = jest
            .spyOn(console, "error")
            .mockImplementationOnce(() => {});

        (NextServerConnector.get as jest.Mock).mockResolvedValueOnce(
            mockFactory,
        );
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(location),
            }),
        );

        const { getByText } = render(<FactoryBio factoryId="1" />);

        await waitFor(() => {
            const civilLocationElement = getByText(expected);
            expect(civilLocationElement).toHaveTextContent(expected);
        });

        consoleErrorMock.mockRestore();
    });

    test("should render EditFactoryForm when clicking on edit icon", async () => {
        const { getByAltText, getByTestId } = render(
            <FactoryBio factoryId="1" />,
        );

        fireEvent.click(getByAltText("edit icon"));

        await waitFor(() => {
            expect(getByTestId("edit-factory")).toBeInTheDocument();
        });
    });

    test("should close EditFactoryForm when the form is closed", async () => {
        const { getByAltText, getByTestId, queryByTestId } = render(
            <FactoryBio factoryId="1" />,
        );

        fireEvent.click(getByAltText("edit icon"));

        await waitFor(() => {
            expect(getByTestId("edit-factory")).toBeInTheDocument();
        });

        act(() => {
            const mockCalls = mockEditFactoryForm.mock.calls[0] as [
                { onClose: () => void },
            ];
            mockCalls[0].onClose();
        });

        await waitFor(() => {
            expect(queryByTestId("edit-factory")).not.toBeInTheDocument();
        });
    });

    test("should close EditFactoryForm when the form is saved", async () => {
        const { getByAltText, getByTestId, queryByTestId } = render(
            <FactoryBio factoryId="1" />,
        );

        fireEvent.click(getByAltText("edit icon"));

        await waitFor(() => {
            expect(getByTestId("edit-factory")).toBeInTheDocument();
        });

        act(() => {
            const mockCalls = mockEditFactoryForm.mock.calls[0] as [
                { onSave: () => void },
            ];
            mockCalls[0].onSave();
        });

        await waitFor(() => {
            expect(queryByTestId("edit-factory")).not.toBeInTheDocument();
        });
    });

    test("should log an error on fetch failure", async () => {
        (NextServerConnector.get as jest.Mock).mockRejectedValueOnce(
            new Error("404"),
        );

        const consoleErrorMock = jest
            .spyOn(console, "error")
            .mockImplementationOnce(() => {});

        render(<FactoryBio factoryId="1" />);

        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalledWith(
                "Error fetching factory:",
                new Error("404"),
            );
        });

        consoleErrorMock.mockRestore();
    });

    test("should log error on location fetch failure", async () => {
        (NextServerConnector.get as jest.Mock).mockResolvedValueOnce(
            mockFactory,
        );
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
            }),
        );

        const consoleErrorMock = jest
            .spyOn(console, "error")
            .mockImplementationOnce(() => {});

        render(<FactoryBio factoryId="1" />);

        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalledWith(
                "Error:",
                new Error("Failed to fetch location: undefined"),
            );
        });

        consoleErrorMock.mockRestore();
    });
});
