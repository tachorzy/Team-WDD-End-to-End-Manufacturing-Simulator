import React from "react";

const ModelIdField= (props: { modelId: string }) => {
    
    const { modelId } = props;

    return (
        <div className="">
            <h1 className="text-2xl font-semibold text-gray-900">
                Model ID
            </h1>
            <div className="flex flex-col gap-y-0.5">
                <h2 className="text-sm font-medium text-[#494949]">
                    Define ID Prefix
                </h2>
                <div className="flex flex-row gap-x-1">
                    <input
                        id="modelIDInput"
                        className="bg-gray-200 p-4 rounded-lg placeholder-gray-400 text-[#494949] w-[6.25rem]"
                        placeholder="e.g. CNC"
                    />
                    <h2 className="text-lg font-medium text-[#494949] mt-3">{`- ${modelId}`}</h2>
                </div>
            </div>
        </div>
    )
};

export default ModelIdField;
