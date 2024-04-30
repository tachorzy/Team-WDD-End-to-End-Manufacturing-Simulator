import React, { useEffect, useState } from "react";
import PropertyChart from "./PropertyChart";
import { BackendConnector, GetConfig } from "@/app/api/_utils/connector";
import { Property } from "@/app/api/_utils/types";

interface DataPoint {
    timeStamp: number;
    value: number;
}

const ChartColumn = (props: { factoryId: string, modelId: string}) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [data, setData] = useState<DataPoint[]>([]);
    // there is mock data for now
    const [measurements, setMeasurements] = useState([
        1.85, 8.0, 16.25, 12.5, 0, 10.0, 8.75, 8.54, 8.34, 9.25, 10.75, 11.25,
        13.45,
    ]);

    const factoryId = props.factoryId;
    const modelId = props.modelId;

    useEffect(() => { 
        const fetchModels = async () => {
            try {
                const config: GetConfig = {
                    resource: "assets",
                    params: { factoryId },
                };
                const newProperties = await BackendConnector.get<Property[]>(config);
                setProperties(newProperties);
            } catch (error) {
                console.error("Failed to fetch assets:", error);
            }
        };

        if (factoryId) {
            fetchModels();
        }
    })



    // useEffect(() => {
    //     const newData = measurements.map((value, index) => ({
    //         timeStamp: Date.now() + index * 60000,
    //         value,
    //     }));
    //     setData(newData);

    //     // the interval is a temporary addition, new data will be fetched from the backend rather than handled on the frontend.
    //     const intervalId = setInterval(() => {
    //         setMeasurements((prev) => {
    //             const lastValue = prev[prev.length - 1];
    //             const nextValue = Math.random() * 22 - 0;
    //             return [...prev.slice(1), lastValue + nextValue * -1];
    //         });
    //     }, 6000);

    //     return () => {
    //         clearInterval(intervalId); // clear the interval when the component unmounts
    //     };
    // }, [measurements]);

    return (
        <div className="flex flex-col mb-3 pl-5 gap-y-3 w-full h-64 overflow-y-scroll border-2 border-[#E2E4EA] bg-[#FAFAFA] rounded-lg">
            <PropertyChart data={data} />
        </div>
    );
};

export default ChartColumn;
