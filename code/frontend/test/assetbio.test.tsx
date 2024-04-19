/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AssetBio from "../components/factorydashboard/floormanager/AssetBio";

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

    test("should render render without error", () => {
        render(<AssetBio asset={undefined} />);
    });

    test("should render asset", async () => {
        const asset = {
            assetId: "1",
            factoryId: "1",
            name: "Asset 1",
            description: "Asset 1 description",
            imageData: "https://www.example.com/image.jpg",
            modelId: "1",
            modelUrl:"2",
            floorplanCords: { x: 0, y: 0 },
        };

        const { getByAltText, getByText } = render(<AssetBio asset={asset} />);

        await waitFor(() => {
            expect(getByAltText("Asset Image")).toHaveAttribute(
                "src",
                "http://test.com/test.png",
            );
            expect(getByText("Asset 1")).toBeInTheDocument();
            expect(
                getByText("Description: Asset 1 description"),
            ).toBeInTheDocument();
        });
    });

    test("should render asset withouth imageData", async () => {
        const asset = {
            assetId: "1",
            factoryId: "1",
            name: "Asset 1",
            description: "Asset 1 description",
            imageData: "",
            modelId: "1",
            floorplanCords: { x: 0, y: 0 },
            modelUrl:" "
        };

        const { getByAltText, getByText } = render(<AssetBio asset={asset} />);

        await waitFor(() => {
            expect(getByAltText("Asset Image")).toHaveAttribute(
                "src",
                "/icons/floorplan/placeholder-asset.svg",
            );
            expect(getByText("Asset 1")).toBeInTheDocument();
            expect(
                getByText("Description: Asset 1 description"),
            ).toBeInTheDocument();
        });
    });
});
