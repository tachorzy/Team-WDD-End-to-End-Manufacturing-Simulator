import React, { useEffect, useState } from "react";
import PropertyChart from "./PropertyChart";
import { BackendConnector, GetConfig } from "@/app/api/_utils/connector";
import { Property } from "@/app/api/_utils/types";

interface DataPoint {
    date: Date;
    value: number;
}

const ChartColumn = (props: { factoryId: string, modelId: string}) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [data, setData] = useState<DataPoint[]>([]);
    // there is mock data for now
    // const [measurements, setMeasurements] = useState([
    //     1.85, 8.0, 16.25, 12.5, 0, 10.0, 8.75, 8.54, 8.34, 9.25, 10.75, 11.25,
    //     13.45,
    // ]);

    const factoryId = props.factoryId;
    const modelId = props.modelId;

    useEffect(() => {
        const fetchModels = async () => {
          try {
            const response = await fetch(`awsendpointurl/properties/data?modelId=${modelId}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const newProperties = await response.json();
            setProperties(newProperties);
            newProperties.array.forEach((property: DataPoint) => {
                setData((prevData) => [
                    ...prevData,
                    {
                        date: property.date,
                        value: property.value,
                    },
                ]);
            });
          } catch (error) {
            console.error("Failed to fetch assets:", error);
          }
        };
    
        if (modelId) {
          fetchModels();
        }
      }, [modelId]); 

    return (
        <div className="flex flex-col mb-3 pl-5 gap-y-3 w-full h-64 overflow-y-scroll border-2 border-[#E2E4EA] bg-[#FAFAFA] rounded-lg">
            {properties.map((property) => (
                <PropertyChart data={data} property={property} />
            ))}
                  
        </div>
    );
};

export default ChartColumn;
