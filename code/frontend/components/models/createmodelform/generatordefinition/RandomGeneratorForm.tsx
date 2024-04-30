import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Property, Measurement } from "@/app/api/_utils/types";

const RandomGeneratorForm = (props: {
    propertyIndex: number;
    property: Property;
    measurements: Measurement[];
    setMeasurements: React.Dispatch<React.SetStateAction<Measurement[]>>;
}) => {
    const { propertyIndex, property, measurements, setMeasurements } = props;
    const [frequency, setFrequency] = useState<number>(0.0);
    const [minValue, setMinValue] = useState<number>(0.0);
    const [maxValue, setMaxValue] = useState<number>(0.0);

    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            const data: Measurement = {
                measurementId: "", // REPLACE
                modelId: "", // REPLACE
                factoryId: "", // REPLACE
                lowerBound: minValue,
                upperBound: maxValue,
                frequency,
                precision: 0.0,
                generatorFunction: "random",
            };

            setMeasurements([...measurements, data]);
        }, 500);
    }, [frequency, minValue, maxValue, measurements, setMeasurements]);

    return (
        <div className="flex flex-col gap-y-3 max-h-72">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Property {propertyIndex + 1} - {property.name}
                </h1>
                <div className="flex flex-row gap-x-0.5">
                    <Image
                        src="/icons/generation/random.svg"
                        width={20}
                        height={20}
                        alt="random wave"
                    />
                    <h2 className="text-sm font-medium text-DarkBlue">
                        Randomized function
                    </h2>
                </div>
            </div>
            <div className="flex flex-col gap-y-3">
                <div className="flex flex-row items-start">
                    <div className="flex flex-col">
                        <h2 className="text-sm font-medium text-[#494949]">
                            Frequency (ms)
                        </h2>
                        <input
                            onChange={(e) =>
                                setFrequency(parseFloat(e.target.value))
                            }
                            className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                            placeholder="e.g. 60000"
                        />
                    </div>
                    <div className="flex flex-row">
                        <div className="flex flex-col w-1/2">
                            <h2 className="text-sm font-medium text-[#494949]">
                                Minimum value
                            </h2>
                            <input
                                onChange={(e) =>
                                    setMinValue(parseFloat(e.target.value))
                                }
                                className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                                placeholder="e.g. 0"
                            />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <h2 className="text-sm font-medium text-[#494949]">
                                Maximum value
                            </h2>
                            <input
                                onChange={(e) =>
                                    setMaxValue(parseFloat(e.target.value))
                                }
                                className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                                placeholder="e.g. 100"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RandomGeneratorForm;
