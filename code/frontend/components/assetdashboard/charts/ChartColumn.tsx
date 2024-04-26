import React from "react";
import PropertyChart from "./PropertyChart";
import SineWaveChart from "./SineWaveChart";

// import { Asset } from "@/app/types/types";

interface DataPoint {
    timeStamp: number;
    [key: string]: number;
}

const ChartColumn = () => {
    const measurements = [10.85, 8.00, 16.25, 12.50, 10.00, 8.75, 8.54, 8.34, 9.25, 10.75, 11.25, 13.45];

    const data: DataPoint[] = measurements.map(measurement => ({
        timeStamp: Date.now(),
        measurement
    }));

   return (
        <div className="flex flex-col mb-3 gap-y-4 w-full h-64 overflow-y-scroll border-2 border-[#E2E4EA] bg-[#FAFAFA] rounded-lg">
            <PropertyChart data={data} unit={"°C"}/>
            <SineWaveChart data={data} unit={"°C"}/>
        </div>
    )
};
export default ChartColumn;
