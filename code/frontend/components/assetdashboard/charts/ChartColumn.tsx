import React, { useEffect, useState } from "react";
import { BackendConnector, GetConfig } from "@/app/api/_utils/connector";
import { Property, PropertyData } from "@/app/api/_utils/types";
import PropertyChart from "./PropertyChart";

const ChartColumn = (props: { factoryId: string; modelId: string }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [data, setData] = useState<PropertyData[]>([]);

    const { factoryId } = props;
    const { modelId } = props;

    useEffect(() => {
        const fetchPropertybyModel = async () => {
            try {
                const config: GetConfig = {
                    resource: "properties",
                    params: { modelId },
                };
                const fetchedProperties =
                    await BackendConnector.get<Property[]>(config);
                setProperties(fetchedProperties);
            } catch (error) {
                console.error("Failed to fetch models:", error);
            }
        };

        if (modelId) {
            fetchPropertybyModel();
        }
    }, [modelId]);

    return (
        <div className="flex flex-col mb-3 pl-5 gap-y-3 w-full h-64 overflow-y-scroll border-2 border-[#E2E4EA] bg-[#FAFAFA] rounded-lg">
            {properties.map((property, index) => (
                <div key={index}>
                    <PropertyChart property={property} />
                </div>
            ))}
        </div>
    );
};

export default ChartColumn;
