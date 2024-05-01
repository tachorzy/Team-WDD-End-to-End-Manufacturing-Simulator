import { Model } from "@/app/api/_utils/types";
import { BackendConnector, GetConfig } from "@/app/api/_utils/connector";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const InventoryNavBar = (props: {
    factoryId: string;
    activeNavItem: string;
    setActiveNavItem: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const [models, setModels] = useState<Model[]>([]);

    const { factoryId, activeNavItem, setActiveNavItem } = props;

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const config: GetConfig = {
                    resource: "models",
                    params: { factoryId },
                };
                const newModels = await BackendConnector.get<Model[]>(config);
                setModels(newModels);
                setActiveNavItem(newModels[0].modelId);
            } catch (error) {
                console.error("Failed to fetch models:", error);
            }
        };

        if (factoryId) {
            fetchModels();
        }
    }, [factoryId]);

    return (
        <div className="flex self-start flex-row gap-x-3">
            {models.length === 0 && (
                <Link
                    href={`/factorydashboard/${factoryId}/assetmodels`}
                    className="flex flex-row gap-x-1 align-middle px-1 py-0.5 font-bold hover:bg-red-50 text-xs text-red-600 hover:text-[#494949] rounded-sm"
                >
                    <p className="group text-red-300 text-xs font-bold">
                        No models found <span className="font-bold">+</span>
                    </p>
                </Link>
            )}
            {models.map((model, id) => (
                <button
                    key={id}
                    type="button"
                    onClick={() => setActiveNavItem(model.modelId)}
                    className={`${
                        model.modelId === activeNavItem
                            ? "text-MainBlue"
                            : "text-[#494949]"
                    }  group cursor-pointer font-medium text-xs mt-1.5`}
                >
                    {model.attributes[0].value}
                    {model.modelId === activeNavItem ? (
                        <span className="block max-w-0 max-w-full transition-all duration-500 pt-[0.2rem] bg-MainBlue -mb-1.5 z-50 relative" />
                    ) : (
                        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 pt-[0.2rem] bg-MainBlue -mb-1.5 z-50 relative" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default InventoryNavBar;
