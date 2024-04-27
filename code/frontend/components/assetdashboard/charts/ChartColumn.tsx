import React, { useEffect, useState } from "react";
import PropertyChart from "./PropertyChart";

interface DataPoint {
    timeStamp: number;
    value: number;
}

const ChartColumn = () => {
    const [data, setData] = useState<DataPoint[]>([]);
    // there is mock data for now
    const [measurements, setMeasurements] = useState([
        1.85, 8.0, 16.25, 12.5, 0, 10.0, 8.75, 8.54, 8.34, 9.25, 10.75, 11.25, 13.45,
    ]);

    useEffect(() => {
        const newData = measurements.map((value, index) => ({
            timeStamp: Date.now() + index * 60000,
            value,
        }));
        setData(newData);

        // the interval is a temporary addition, new data will be fetched from the backend rather than handled on the frontend.
        const intervalId = setInterval(() => {
            setMeasurements((prev) => {
                const lastValue = prev[prev.length - 1];
                const nextValue = Math.random() * 22 - 2;
                return [...prev.slice(1), lastValue + nextValue];
            });
        }, 6000);
    
        return () => {
            clearInterval(intervalId); // clear the interval when the component unmounts
        };
    }, [measurements]);

    return (
        <div className="flex flex-col mb-3 pl-5 gap-y-3 w-full h-64 overflow-y-scroll border-2 border-[#E2E4EA] bg-[#FAFAFA] rounded-lg">
            <PropertyChart data={data} />
        </div>
    );
};

export default ChartColumn;
