import React, { useEffect, useState } from "react";
import { BackendConnector, GetConfig } from "@/app/api/_utils/connector";
import { Model } from "@/app/api/_utils/types";

const ModelTable: React.FC<{ factoryId: string }> = ({ factoryId }) => {
    const mockModels: Model[] = [
        {
            modelId: "model-1",
            factoryId: "factory-1",
            attributes: [
                {
                    factoryId: "factory-1",
                    modelId: "1",
                    name: "Height",
                    value: "10 meters",
                },
                {
                    factoryId: "factory-1",
                    modelId: "1",
                    name: "Weight",
                    value: "500 kg",
                },
                {
                    factoryId: "factory-1",
                    modelId: "1",
                    name: "Color",
                    value: "Blue",
                },
            ],
            properties: [
                {
                    factoryId: "factory-1",
                    modelId: "1",
                    measurementId: "1",
                    name: "Temperature",
                    unit: "Celsius",
                    generatorType: "constant",
                },
                {
                    factoryId: "factory-1",
                    modelId: "1",
                    measurementId: "2",
                    name: "Voltage",
                    unit: "Volts",
                    generatorType: "sine wave",
                },
                {
                    factoryId: "factory-1",
                    modelId: "1",
                    measurementId: "3",
                    name: "Pressure",
                    unit: "Pascal",
                    generatorType: "sawtooth",
                },
            ],
        },
        {
            modelId: "model-2",
            factoryId: "factory-1",
            attributes: [
                {
                    factoryId: "factory-1",
                    modelId: "2",
                    name: "Height",
                    value: "12 meters",
                },
                {
                    factoryId: "factory-1",
                    modelId: "2",
                    name: "Weight",
                    value: "600 kg",
                },
                {
                    factoryId: "factory-1",
                    modelId: "2",
                    name: "Color",
                    value: "Red",
                },
            ],
            properties: [
                {
                    factoryId: "factory-1",
                    modelId: "2",
                    measurementId: "4",
                    name: "Temperature",
                    unit: "Celsius",
                    generatorType: "sine wave",
                },
                {
                    factoryId: "factory-1",
                    modelId: "2",
                    measurementId: "5",
                    name: "Voltage",
                    unit: "Volts",
                    generatorType: "sawtooth",
                },
                {
                    factoryId: "factory-1",
                    modelId: "2",
                    measurementId: "6",
                    name: "Pressure",
                    unit: "Pascal",
                    generatorType: "constant",
                },
            ],
        },
    ];

    // This is actual back end connection
    /* useEffect(() => {
        const fetchModels = async () => {
            try {
                const config: GetConfig = {
                    resource: "assetmodels",
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
    }, [factoryId]); */

    const [assets, setAssets] = useState<Partial<Model>[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const assetsPerPage = 3;

    useEffect(() => {
        // Simulating fetching data from the backend
        setAssets(mockModels.filter((model) => model.factoryId === factoryId));
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
                    {currentAssets.map((model, index) => (
                        <tr
                            key={model.modelId}
                            className={`border-t border-gray-200 ${index % 2 === 0 ? "bg-gray-100" : ""}`}
                        >
                            <td className="px-4 py-2 w-1/4">{model.modelId}</td>
                            <td className="px-4 py-2 text-DarkBlue font-semibold break-words">
                                {model.attributes &&
                                    model.attributes.map((attribute) => (
                                        <div key={index}>
                                            {attribute.name}: {attribute.value}
                                        </div>
                                    ))}
                            </td>
                            <td className="px-4 py-2 text-[#494949] text-xs break-words">
                                {model.properties &&
                                    model.properties.map((property) => (
                                        <div key={index}>
                                            {property.name}: {property.unit}
                                        </div>
                                    ))}
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
                <span className="px-4 py-2 border rounded bg-blue-500 text-white">
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
