import React from "react";

const NameField = (props: { modelId: string }) => {
    const { modelId } = props;

    return (
        <div className="">
            <h1 className="text-2xl font-semibold text-gray-900">Model Name</h1>
            <div className="flex flex-col gap-y-0.5">
                <h2 className="text-sm font-medium text-[#494949]">
                    Enter a model name
                </h2>
                <div className="flex flex-row gap-x-1">
                    <input
                        id="nameInput"
                        className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-full"
                        placeholder="e.g. CNC 1"
                    />
                </div>
            </div>
        </div>
    );
};

export default NameField;
