import React from "react";

const NameField = (props: { modelId: string }) => {
    const { modelId } = props;

    return (
        <div className="">
            <h1 className="text-2xl font-semibold text-gray-900">Model Name</h1>
            <div className="flex flex-col gap-y-0.5">
                <div className="flex flex-row gap-x-1">
                    <input
                        id="nameInput"
                        className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-full"
                        placeholder="Enter a model name"
                    />
                </div>
            </div>
        </div>
    );
};

export default NameField;
