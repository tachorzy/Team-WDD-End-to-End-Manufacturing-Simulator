import React from "react";

const AttributeInputColumn = (props: {
    properties: { property: string; unit: string }[];
}) => {
    const { properties } = props;

    return (
        <div className="flex flex-col gap-y-3 max-h-96 overflow-y-scroll">
            <h1 className="text-2xl font-semibold text-gray-900">Properties</h1>
            {properties.map((property, index) => (
                <div key={index} className="flex flex-col gap-y-3">
                    <div className="flex flex-row items-start">
                        <div className="flex flex-col">
                            <h2 className="text-sm font-medium text-[#494949]">
                                {`Property ${index + 1}`}
                            </h2>
                            <input
                                className="bg-gray-200 p-4 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                                placeholder="e.g. Temperature"
                            />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-medium text-[#494949]">
                                Units
                            </h2>
                            <input
                                className="bg-gray-200 p-4 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                                placeholder="e.g. °C"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttributeInputColumn;
