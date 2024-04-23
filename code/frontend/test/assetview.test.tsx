/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Asset } from "@/app/types/types";
import AssetView from "@/components/assetdashboard/AssetView";

global.URL.createObjectURL = jest
    .fn()
    .mockReturnValue("http://test.com/test.png");

jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: any) => <img alt="" {...props} />,
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

    test("should render without error", () => {
        const asset = {
            factoryId: "1",
            name: "Asset 1",
            description: "Asset 1 description",
            imageData: "https://www.example.com/image.jpg",
        };

        render(<AssetView asset={asset as Asset} />);
    });

    test("should render asset image in asset view", async () => {
        const asset = {
            factoryId: "1",
            name: "Asset 1",
            description: "Asset 1 description",
            imageData: "https://www.example.com/image.jpg",
        };

        const { getByAltText, getByText } = render(<AssetView asset={asset} />);

        await waitFor(() => {
            expect(getByAltText("asset image")).toHaveAttribute(
                "src",
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

        const { getByAltText, getByText } = render(<AssetView asset={asset} />);

        await waitFor(() => {
            expect(getByAltText("asset image")).toHaveAttribute(
                "src",
                "/icons/floorplan/placeholder-asset.svg",
            );
            expect(getByText("Asset View")).toBeInTheDocument();
        });
    });
});