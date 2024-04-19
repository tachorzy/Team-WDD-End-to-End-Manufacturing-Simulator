import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Measurement, Property } from "@/app/api/_utils/types";

const SineWaveGeneratorForm = (props: {
    propertyIndex: number;
    property: Property;
    measurements: Measurement[];
    setMeasurements: React.Dispatch<React.SetStateAction<Measurement[]>>;
}) => {
    const { propertyIndex, property, measurements, setMeasurements } = props;
    const [frequency, setFrequency] = useState<number>(0.0);
    const [angularFrequency, setAngularFrequency] = useState<number>(0.0);
    const [amplitude, setAmplitude] = useState<number>(0.0);
    const [phase, setPhase] = useState<number>(0.0);
    const [maxValue, setMaxValue] = useState<number>(0.0);

    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            const data: Measurement = {
                measurementId: property.measurementId,
                propertyId: property.propertyId,
                modelId: property.modelId,
                factoryId: property.factoryId,
                lowerBound: 0.0,
                upperBound: maxValue,
                frequency,
                angularFrequency,
                amplitude,
                phase,
                precision: 0.0,
                generatorFunction: "sinewave",
            };

            setMeasurements([...measurements, data]);
        }, 500);
    }, [frequency, angularFrequency, amplitude, phase, maxValue]);

    return (
        <div className="flex flex-col gap-y-3 max-h-72">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Property {propertyIndex} - {property.name}
                </h1>
                <div className="flex flex-row gap-x-1">
                    <Image
                        src="/icons/generation/sine-waves.svg"
                        width={20}
                        height={20}
                        alt="sine wave"
                    />
                    <h2 className="text-sm font-medium text-DarkBlue">
                        Sine wave function
                    </h2>
                </div>
            </div>
            <div className="flex flex-col gap-y-3">
                <div className="flex flex-row items-start">
                    <div className="flex flex-col gap-y-2">
                        <h2 className="text-sm font-medium text-[#494949]">
                            Frequency (ms)
                        </h2>
                        <input
                            onChange={(e) =>
                                setFrequency(Number(e.target.value))
                            }
                            className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                            placeholder="e.g. 60000"
                        />
                        <h2 className="text-sm font-medium text-[#494949]">
                            Angular frequency (ω)
                        </h2>
                        <input
                            onChange={(e) =>
                                setAngularFrequency(Number(e.target.value))
                            }
                            className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                            placeholder="e.g. 1000"
                        />
                    </div>
                    <div className="flex flex-row">
                        <div className="flex flex-col gap-y-2 w-1/2">
                            <h2 className="text-sm font-medium text-[#494949]">
                                Amplitude
                            </h2>
                            <input
                                onChange={(e) =>
                                    setAmplitude(Number(e.target.value))
                                }
                                className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                                placeholder="e.g. 2"
                            />
                            <h2 className="text-sm font-medium text-[#494949]">
                                Phase
                            </h2>
                            <input
                                onChange={(e) =>
                                    setPhase(Number(e.target.value))
                                }
                                className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                                placeholder="e.g. 0.5"
                            />
                        </div>
                        <div className="flex flex-col gap-y-2 w-1/2">
                            <h2 className="text-sm font-medium text-[#494949]">
                                Maximum value
                            </h2>
                            <input
                                onChange={(e) =>
                                    setMaxValue(Number(e.target.value))
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

export default SineWaveGeneratorForm;
