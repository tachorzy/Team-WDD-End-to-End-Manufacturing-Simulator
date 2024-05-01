/**
 * @jest-environment jsdom
 */
import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Asset } from "@/app/types/types";
import AssetOverview from "@/components/assetdashboard/AssetOverview";

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

        const { getByText } = render(
            <AssetOverview asset={asset} />,
        );

        expect(getByText(`${asset.name}`)).toBeInTheDocument();
        expect(getByText("Asset Model:")).toBeInTheDocument();
        expect(getByText("Asset Properties:")).toBeInTheDocument();
    });
});
