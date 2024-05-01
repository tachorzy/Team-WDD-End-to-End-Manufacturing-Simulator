import { useState, useEffect } from "react";
import { BackendConnector, GetConfig } from "@/app/api/_utils/connector";
import { Combobox } from "@headlessui/react";
import { Model } from "@/app/api/_utils/types";

const ModelCombobox = (props: {
    factoryId: string,
    setModelId: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const { factoryId, setModelId } = props;

    const [models, setModels] = useState<Model[]>([]);
    const [selectedModel, setSelectedModel] = useState("");
    const [query, setQuery] = useState("");

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const config: GetConfig = {
                    resource: "models",
                    params: { factoryId },
                };
                const newModels = await BackendConnector.get<Model[]>(config);
                setModels(newModels);
            } catch (error) {
                console.error("Failed to fetch models:", error);
            }
        };

        if (factoryId) {
            fetchModels();
        }
    }, [factoryId]);

    useEffect(() => {
        const model = models.filter((model) => model.attributes[0].value === selectedModel)[0];
        const selectedModelId = model?.modelId
        setModelId(selectedModelId);
    }, [selectedModel, setModelId]);

    const filteredModels =
        query === ""
            ? models
            : models.filter((model) =>
                model.attributes[0].value.toLowerCase().includes(query.toLowerCase()),
              );

    return (
        <Combobox
            value={selectedModel}
            onChange={setSelectedModel}
            data-testid="combobox-gen-functions"
        >
            <div className="relative flex flex-col gap-y-1">
                <Combobox.Input
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Select asset model"
                    className="w-[95.65%] p-2 rounded-lg border-2 border-[#DADADA] text-[#494949] text-medium placeholder-gray-400 "
                />
                <Combobox.Options className="mt-12 absolute z-50 w-[95.65%] bg-white rounded-lg border-2 border-[#DADADA] text-gray-400 placeholder-gray-400 text-medium">
                    {filteredModels.map((model) => (
                        <Combobox.Option
                            key={model.modelId}
                            value={model.attributes[0].value}
                            className="text-sm hover:bg-gray-100 pl-3 p-1.5 cursor-pointer"
                        >
                            {model.attributes[0].value}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </div>
        </Combobox>
    );
};

export default ModelCombobox;
