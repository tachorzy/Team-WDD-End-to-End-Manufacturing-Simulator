import React from "react";
import Image from "next/image";
import { Property } from "@/app/api/_utils/types";

const SineWaveGeneratorForm = (props: { propertyIndex: number, property: Property}) => {
    const { propertyIndex } = props; 

    return (
        <div className="flex flex-col gap-y-3 max-h-72">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Properties {propertyIndex}</h1>
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
                            className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                            placeholder="e.g. 60000"
                        />
                        <h2 className="text-sm font-medium text-[#494949]">
                            Angular frequency (ω)
                        </h2>
                        <input
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
                                className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                                placeholder="e.g. 2"
                            />
                            <h2 className="text-sm font-medium text-[#494949]">
                                Phase
                            </h2>
                            <input
                                className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                                placeholder="e.g. 0.5"
                            />
                        </div>
                        <div className="flex flex-col gap-y-2 w-1/2">
                            <h2 className="text-sm font-medium text-[#494949]">
                                Maximum value
                            </h2>
                            <input
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
