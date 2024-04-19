/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Asset } from "@/app/api/_utils/types";
import { BackendConnector } from "@/app/api/_utils/connector";
import FloorManager, {
    FloorManagerProps,
} from "../components/factorydashboard/floormanager/FloorManager";

const mockAsset: Asset = {
    assetId: "1",
    name: "Mock Asset 1",
    description: "Mock Description 1",
    imageData: "mockImage1.jpg",
    factoryId: "1",
};

jest.mock("@/app/api/_utils/connector", () => ({
    BackendConnector: {
        get: jest.fn(),
    },
}));

const mockInventoryNavBar = jest.fn();
jest.mock(
    "../components/factorydashboard/floormanager/inventory/InventoryNavBar",
    () => {
        const MockInventoryNavBar = (props: any) => {
            mockInventoryNavBar(props);
            return <div data-testid="inventory-navbar" />;
        };
        MockInventoryNavBar.displayName = "InventoryNavBar";
        return MockInventoryNavBar;
    },
);

const mockAssetInventory = jest.fn();
jest.mock(
    "../components/factorydashboard/floormanager/inventory/AssetInventory",
    () => {
        const MockAssetInventory = (props: any) => {
            mockAssetInventory(props);
            return <div data-testid="asset-inventory" />;
        };
        MockAssetInventory.displayName = "AssetInventory";
        return MockAssetInventory;
    },
);

const mockAddAssetForm = jest.fn();
jest.mock(
    "../components/factorydashboard/floormanager/assetform/AddAssetForm",
    () => {
        const MockAddAssetForm = (props: any) => {
            mockAddAssetForm(props);
            return <div data-testid="asset-form" />;
        };
        MockAddAssetForm.displayName = "AddAssetForm";
        return MockAddAssetForm;
    },
);

const mockAssetMarker = jest.fn();
jest.mock(
    "../components/factorydashboard/floorplan/blueprint/marker/AssetMarker",
    () => {
        const MockAssetMarker = (props: any) => {
            mockAssetMarker(props);
            return <div />;
        };
        MockAssetMarker.displayName = "AssetMarker";
        return MockAssetMarker;
    },
);

const mockAssetBio = jest.fn();
jest.mock("../components/factorydashboard/floormanager/AssetBio", () => {
    const MockAssetBio = (props: any) => {
        mockAssetBio(props);
        return <div data-testid="asset-bio" />;
    };
    MockAssetBio.displayName = "AssetBio";
    return MockAssetBio;
});

const mockSetAssetMarkers = jest.fn();
const props: FloorManagerProps = {
    setAssetMarkers: mockSetAssetMarkers,
    factoryId: "1",
};

describe("FloorManager", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should render without errors", async () => {
        const { getByAltText, getByText, getByTestId } = render(
            <FloorManager {...props} />,
        );

        await waitFor(() => {
            expect(getByAltText("brand")).toBeInTheDocument();
            expect(getByText("Floor Manager")).toBeInTheDocument();
            expect(getByTestId("inventory-navbar")).toBeInTheDocument();
            expect(getByTestId("asset-inventory")).toBeInTheDocument();
            expect(getByText("Add Asset")).toBeInTheDocument();
            expect(getByTestId("asset-bio")).toBeInTheDocument();
        });
    });

    test("should render AddAssetForm when 'Add Asset' button is clicked", async () => {
        const { getByText, getByTestId } = render(<FloorManager {...props} />);

        fireEvent.click(getByText("Add Asset"));

        await waitFor(() => {
            expect(getByTestId("asset-form")).toBeInTheDocument();
        });
    });

    test("should render AssetMarker when asset is selected", async () => {
        const { getByText } = render(<FloorManager {...props} />);

        await waitFor(() => {
            const assetInventoryMockCall = mockAssetInventory.mock.calls[0] as [
                { setSelectedAsset: (asset: Asset) => void },
            ];
            assetInventoryMockCall[0].setSelectedAsset(mockAsset);

            fireEvent.click(getByText("Place Asset"));

            const setAssetMarkersMockCall = mockSetAssetMarkers.mock
                .calls[0] as [(prevMarkers: JSX.Element[]) => JSX.Element[]];
            const addNewAssetMarker = setAssetMarkersMockCall[0];

            interface AssetMarkerProps {
                asset: Asset;
            }
            const prevMarkers = [<div />];
            const assetMarkers: React.ReactElement<AssetMarkerProps>[] =
                addNewAssetMarker(prevMarkers);

            expect(mockSetAssetMarkers).toHaveBeenCalledWith(addNewAssetMarker);
            expect(assetMarkers).toHaveLength(2);
            expect(assetMarkers[1].props.asset).toEqual(mockAsset);
        });
    });

    test("should add new asset when AddAssetForm is filled out and submitted", async () => {
        (BackendConnector.get as jest.Mock).mockResolvedValue([mockAsset]);

        const { getByText } = render(<FloorManager {...props} />);

        fireEvent.click(getByText("Add Asset"));

        await waitFor(() => {
            const newAsset: Asset = {
                assetId: "2",
                name: "Mock Asset 2",
                description: "Mock Description 2",
                imageData: "mockImage2.jpg",
                factoryId: "1",
                modelId: "1",
                modelUrl:"ff",
                floorplanCords: { x: 0, y: 0 },
            };

            const addAssetFormOnAddCall = mockAddAssetForm.mock.calls[0] as [
                { onAdd: (newAsset: Asset) => void },
            ];
            addAssetFormOnAddCall[0].onAdd(newAsset);

            const addAssetFormOnCloseCall = mockAddAssetForm.mock.calls[0] as [
                { onClose: () => void },
            ];
            addAssetFormOnCloseCall[0].onClose();

            const assetInventoryMockCall = mockAssetInventory.mock.calls[2] as [
                { assets: Asset[] },
            ];
            expect(assetInventoryMockCall[0].assets).toEqual([
                mockAsset,
                newAsset,
            ]);
        });
    });

    test("should log error on fetch failure", async () => {
        const conolseErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        (BackendConnector.get as jest.Mock).mockRejectedValueOnce(
            new Error("404"),
        );

        render(<FloorManager {...props} />);

        await waitFor(() => {
            expect(conolseErrorSpy).toHaveBeenCalledWith(
                "Failed to fetch assets:",
                new Error("404"),
            );
        });

        conolseErrorSpy.mockRestore();
    });
});
