/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";
import AssetItem from "../components/factorydashboard/floormanager/AssetItem";
// code\frontend\components\factorydashboard\floormanager\AssetItem.tsx
describe("AssetItem", () => {
    test("should render correctly with valid asset", () => {
        const asset = {
            id: "1",
            name: "Asset 1",
            description: "Description",
            image: "test.jpg",
        };

        const { getByText, getByAltText } = render(<AssetItem asset={asset} />);

        expect(getByText("Name: Asset 1")).toBeInTheDocument();
        expect(getByText("Description: Description")).toBeInTheDocument();
        expect(getByAltText("Asset 1")).toBeInTheDocument();
    });

    test("should render asset name when asset is undefined", () => {
        const { getByText } = render(<AssetItem />);

        expect(getByText("No asset data available")).toBeInTheDocument();
    });
});
