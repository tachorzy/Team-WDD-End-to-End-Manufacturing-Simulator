/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AssetBio from "../components/factorydashboard/floormanager/AssetBio";

global.URL.createObjectURL = jest.fn().mockReturnValue("https://www.example.com/image.jpg");

global.fetch = jest.fn(()=> 
    Promise.resolve({
        blob: () => Promise.resolve('mocked blob'),
    })
) as jest.Mock;

jest.spyOn(console, "error").mockImplementation(() => {});

describe("AssetBio", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test("should render render without error",  () => {
        render(<AssetBio asset={undefined}/>);
    });

    test("should render asset", async () => {
        const asset = {
            factoryId: "1",
            name: "Asset 1",
            description: "Asset 1 description",
            imageData: "https://www.example.com/image.jpg",
        };

        const { getByAltText, getByText } = render(<AssetBio asset={asset} />);

        await waitFor(() => {
            expect(getByAltText("Asset Image")).toHaveAttribute("src", "/_next/image?url=https%3A%2F%2Fwww.example.com%2Fimage.jpg&w=256&q=75");
            expect(getByText("Asset 1")).toBeInTheDocument();
            expect(getByText("Description: Asset 1 description")).toBeInTheDocument();
        });
    });

    test("should render asset withouth imageData", async () => {
        const asset = {
            factoryId: "1",
            name: "Asset 1",
            description: "Asset 1 description",
            imageData: undefined,
        };

        const { getByAltText, getByText } = render(<AssetBio asset={asset} />);

        await waitFor(() => {
            expect(getByAltText("Asset Image")).toHaveAttribute("src", "/icons/floorplan/placeholder-asset.svg");
            expect(getByText("Asset 1")).toBeInTheDocument();
            expect(getByText("Description: Asset 1 description")).toBeInTheDocument();
        })
    });
});