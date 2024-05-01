/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AssetView from "@/components/assetdashboard/AssetView";

global.URL.createObjectURL = jest
    .fn()
    .mockReturnValue("http://test.com/test.png");

jest.mock("next/image", () => ({
    __esModule: true,
    default: ({ src, ...props }: { src: string }) => {
        const MockNextImage = ({ imageSrc }: { imageSrc: string }) => (
            <div data-testid="mock-next-image" data-src={imageSrc} />
        );

        return <MockNextImage imageSrc={src} {...props} />;
    },
}));

global.fetch = jest.fn(() =>
    Promise.resolve({
        blob: () => Promise.resolve("mocked blob"),
    }),
) as jest.Mock;

describe("AssetBio", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should render asset image in asset view", async () => {
        const asset = {
            factoryId: "1",
            name: "Asset 1",
            description: "Asset 1 description",
            imageData: "https://www.example.com/image.jpg",
        };

        const { getByTestId, getByText } = render(<AssetView asset={asset} />);

        await waitFor(() => {
            expect(getByTestId("mock-next-image")).toHaveAttribute(
                "data-src",
                "http://test.com/test.png",
            );
            expect(getByText("Asset View")).toBeInTheDocument();
        });
    });

    test("should render asset without imageData", async () => {
        const asset = {
            factoryId: "1",
            name: "Asset 1",
            description: "Asset 1 description",
            imageData: undefined,
        };

        const { getByTestId, getByText } = render(<AssetView asset={asset} />);

        await waitFor(() => {
            expect(getByTestId("mock-next-image")).toHaveAttribute(
                "data-src",
                "/icons/floorplan/placeholder-asset.svg",
            );
            expect(getByText("Asset View")).toBeInTheDocument();
        });
    });
});
