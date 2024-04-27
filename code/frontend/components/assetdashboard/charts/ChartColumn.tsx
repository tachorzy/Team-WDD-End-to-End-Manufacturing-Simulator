import React, { useEffect, useState } from "react";
import PropertyChart from "./PropertyChart";

interface DataPoint {
    timeStamp: number;
    value: number;
}

const ChartColumn = () => {
    const [data, setData] = useState<DataPoint[]>([]);

    useEffect(() => {
    //         const measurements = [
    //     1.85, 8.0, 16.25, 12.5, 0, 10.0, 8.75, 8.54, 8.34, 9.25, 10.75, 11.25,
    //     13.45,
    // ];
        const measurements = Array.from({ length: 100 }, (_, i) => i % 20);
        const newData = measurements.map((value, index) => ({
            timeStamp: Date.now() + index * 60000,
            value,
        }));
        setData(newData);
    }, []);

    return (
        <div className="flex flex-col mb-3 pl-5 gap-y-3 w-full h-64 overflow-y-scroll border-2 border-[#E2E4EA] bg-[#FAFAFA] rounded-lg">
            <PropertyChart data={data} />
        </div>
    );
};

export default ChartColumn;
