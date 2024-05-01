import { Model } from "@/app/api/_utils/types";
import { BackendConnector, GetConfig } from "@/app/api/_utils/connector";
import React, { useState, useEffect } from "react";

const InventoryNavBar = (props: { factoryId: string }) => {
    const [activeNavItem, setActiveNavItem] = useState("CNC Models");
    const [models, setModels] = useState<Model[]>([]);

    const { factoryId } = props;

    const navbarLinks = [
        { label: "CNC Models", link: "" },
        {
            label: "Stamping Models",
            link: "",
        },
        { label: "EDM Models", link: "" },
    ];

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

    return (
        <div className="flex self-start flex-row gap-x-3">
            {models.map((model, id) => (
                <button
                    key={id}
                    type="button"
                    onClick={() => setActiveNavItem(model.attributes[0].name)}
                    className={`${
                        model.attributes[0].name === activeNavItem
                            ? "text-MainBlue"
                            : "text-[#494949]"
                    }  group cursor-pointer font-medium text-xs mt-1.5`}
                >
                    {model.attributes[0].value}
                    {model.attributes[0].name === activeNavItem ? (
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
