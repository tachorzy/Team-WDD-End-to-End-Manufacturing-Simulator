import React, { useEffect, useState } from "react";
import { BackendConnector, GetConfig } from "@/app/api/_utils/connector";
import { Asset } from "@/app/api/_utils/types";

const AssetTable: React.FC<{ factoryId: string }> = ({ factoryId }) => {
    const [assets, setAssets] = useState<Partial<Asset>[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const assetsPerPage = 5;

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const config: GetConfig = {
                    resource: "assets",
                    params: { factoryId },
                };
                const newAssets = await BackendConnector.get<Asset[]>(config);
                setAssets(newAssets);
            } catch (error) {
                console.error("Failed to fetch assets:", error);
            }
        };

        if (factoryId) {
            fetchAssets();
        }
    }, [factoryId]);

    // Get current assets
    const indexOfLastAsset = currentPage * assetsPerPage;
    const indexOfFirstAsset = indexOfLastAsset - assetsPerPage;
    const currentAssets = assets.slice(indexOfFirstAsset, indexOfLastAsset);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="p-4">
            <table className="table-auto w-full text-gray-600 bg-white">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Image</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Model ID</th>
                    </tr>
                </thead>
                <tbody>
                    {currentAssets.map((asset, index) => (
                        <tr
                            key={asset.assetId}
                            className={`border-t border-gray-200 ${index % 2 === 0 ? "bg-gray-100" : ""}`}
                        >
                            <td className="px-4 py-2 text-center flex justify-center items-center">
                                <img
                                    src={
                                        asset.imageData ||
                                        "/icons/floorplan/placeholder-asset.svg"
                                    }
                                    alt="Asset"
                                    className="w-20 h-20 object-cover"
                                />
                            </td>
                            <td className="px-4 py-2 text-DarkBlue font-semibold break-words text-center">
                                {asset.name}
                            </td>
                            <td className="px-4 py-2 text-[#494949] text-xs break-words text-center">
                                Description: {asset.description}
                            </td>
                            <td className="px-4 py-2 text-center">
                                {asset.modelId}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination flex justify-center space-x-2 mt-4">
                <button
                    type="button"
                    onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                    className="px-4 py-2 border rounded bg-white text-black"
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                <span
                    className="px-4 py-2 border rounded bg-blue-500 text-white"
                    data-testid="currentpage"
                >
                    {currentPage}
                </span>
                <button
                    type="button"
                    onClick={() =>
                        currentPage <
                            Math.ceil(assets.length / assetsPerPage) &&
                        paginate(currentPage + 1)
                    }
                    className="px-4 py-2 border rounded bg-white text-black"
                    disabled={
                        currentPage === Math.ceil(assets.length / assetsPerPage)
                    }
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default AssetTable;
