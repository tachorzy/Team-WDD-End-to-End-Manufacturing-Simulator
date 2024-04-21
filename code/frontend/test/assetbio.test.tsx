/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Asset } from "@/app/types/types";
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
        const asset = {
            factoryId: "1",
            name: "Asset 1",
            description: "Asset 1 description",
            imageData: "https://www.example.com/image.jpg",
        };

        render(<AssetBio factoryId="12345678" asset={asset as Asset} />);
    });

    test("should render asset", async () => {
        const asset = {
            factoryId: "1",
            name: "Asset 1",
            description: "Asset 1 description",
            imageData: "https://www.example.com/image.jpg",
        };

        const { getByAltText, getByText } = render(
            <AssetBio factoryId={asset.factoryId} asset={asset} />,
        );

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
            factoryId: "1",
            name: "Asset 1",
            description: "Asset 1 description",
            imageData: undefined,
        };

        const { getByAltText, getByText } = render(
            <AssetBio factoryId={asset.factoryId} asset={asset} />,
        );

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
