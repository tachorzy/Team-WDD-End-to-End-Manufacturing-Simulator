import React, { useEffect, useState } from "react";
import { BackendConnector, GetConfig } from "@/app/api/_utils/connector";
import { Model } from "@/app/api/_utils/types";

const ModelTable: React.FC<{ factoryId: string }> = ({ factoryId }) => {
    const [assets, setAssets] = useState<Partial<Model>[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const assetsPerPage = 5;

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const config: GetConfig = {
                    resource: "models",
                    params: { factoryId },
                };
                const newAssets = await BackendConnector.get<Model[]>(config);
                setAssets(newAssets);
            } catch (error) {
                console.error("Failed to fetch models:", error);
            }
        };

        if (factoryId) {
            fetchModels();
        }
    }, [factoryId]);

    const indexOfLastAsset = currentPage * assetsPerPage;
    const indexOfFirstAsset = indexOfLastAsset - assetsPerPage;
    const currentAssets = assets.slice(indexOfFirstAsset, indexOfLastAsset);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="p-4">
            <table className="table-fixed w-full text-gray-600 bg-white">
                <thead>
                    <tr>
                        <th className="px-4 py-2 w-1/4">Model ID</th>
                        <th className="px-4 py-2 w-1/4">Attributes</th>
                        <th className="px-4 py-2 w-1/4">Properties</th>
                        <th className="px-4 py-2 w-1/4">Factory ID</th>
                    </tr>
                </thead>
                <tbody>
                    {assets.length > 0 &&
                        currentAssets.map((model) => (
                            <tr
                                key={model.modelId || ""}
                                className={`border-t border-gray-200 ${typeof model.modelId === "number" && model.modelId % 2 === 0 ? "bg-gray-100" : ""}`}
                            >
                                <td className="px-4 py-2 w-1/4">
                                    {model.modelId}
                                </td>
                                <td className="px-4 py-2 text-DarkBlue font-semibold break-words">
                                    {model.attributes &&
                                        model.attributes.map(
                                            (attribute, index) => (
                                                <div key={index}>
                                                    {attribute.name}:{" "}
                                                    {attribute.value}
                                                </div>
                                            ),
                                        )}
                                </td>
                                <td className="px-4 py-2 text-[#494949] text-xs break-words">
                                    {model.properties &&
                                        model.properties.map(
                                            (property, index) => (
                                                <div key={index}>
                                                    {property.name}:{" "}
                                                    {property.unit}
                                                </div>
                                            ),
                                        )}
                                </td>
                                <td className="px-4 py-2">{model.factoryId}</td>
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

export default ModelTable;
