import React from "react";
import Image from "next/image";

const RandomGeneratorForm = (props: { propertyIndex: number}) => { 
    const { propertyIndex } = props;
    
    return (
        <div className="flex flex-col gap-y-3 max-h-72">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Property {propertyIndex}</h1>
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
                                className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                                placeholder="e.g. 0"
                            />
                        </div>
                        <div className="flex flex-col w-1/2">
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
    )
};


export default RandomGeneratorForm;