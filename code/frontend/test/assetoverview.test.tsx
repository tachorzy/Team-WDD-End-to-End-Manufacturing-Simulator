/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Asset } from "@/app/types/types";
import AssetOverview from "@/components/assetdashboard/AssetOverview";

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

        render(<AssetOverview asset={asset as Asset} />);
    });

    test("should render asset information", () => {
        const asset = {
            factoryId: "1",
            modelId: "1",
            name: "Asset 1",
            description: "Asset 1 description",
            imageData: "https://www.example.com/image.jpg",
        };

        const { getByAltText, getByText } = render(
            <AssetOverview asset={asset} />,
        );

        expect(getByText(`${asset.name}`)).toBeInTheDocument();
        expect(getByText(`${asset.modelId}`)).toBeInTheDocument();
    });
});
