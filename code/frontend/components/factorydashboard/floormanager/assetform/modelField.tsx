import React, { useState, useEffect } from "react";
import { Model, Attribute, Asset } from "@/app/api/_utils/types";
import { BackendConnector, GetConfig } from "@/app/api/_utils/connector";

interface ModelFieldProps {
    factoryId: string;
    setModelId: (modelId: string) => void;
    setFormData: React.Dispatch<React.SetStateAction<Asset>>;
}

const ModelField: React.FC<ModelFieldProps> = ({
    factoryId,
    setModelId,
    setFormData,
}) => {
    const [models, setModels] = useState<Model[]>([]);
    const [selectedModelId, setSelectedModelId] = useState("");

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const config: GetConfig = {
                    resource: "models",
                    params: { factoryId },
                };
                const fetchedModels =
                    await BackendConnector.get<Model[]>(config);
                setModels(fetchedModels);
            } catch (error) {
                console.error("Failed to fetch models:", error);
            }
        };

        if (factoryId) {
            fetchModels();
        }
    }, [factoryId]);

    const handleSelectChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const newModelId = event.target.value;
        setSelectedModelId(newModelId);
        setModelId(newModelId);
        setFormData((prevData) => ({
            ...prevData,
            modelId: newModelId,
        }));
    };

    const findModelName = (attributes: Attribute[]) => {
        const nameAttribute = attributes.find((attr) => attr.name === "name");
        return nameAttribute ? nameAttribute.value : "";
    };

    return (
        <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">
                Select a Model
            </h1>
            <select
                value={selectedModelId}
                onChange={handleSelectChange}
                className="form-select bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-full"
            >
                <option value="" disabled>
                    Select a model
                </option>
                {models.map((model) => (
                    <option key={model.modelId} value={model.modelId}>
                        {findModelName(model.attributes)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ModelField;
