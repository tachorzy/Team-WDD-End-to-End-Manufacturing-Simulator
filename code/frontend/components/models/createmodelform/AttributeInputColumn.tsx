import React from "react";
import Image from "next/image";

const AttributeInputColumn = (props: {
    attributes: { attribute: string; value: string }[];
}) => {
    const { attributes } = props;

    return (
        <div className="flex flex-col gap-y-3 max-h-96 overflow-y-scroll">
            <h1 className="text-2xl font-semibold text-gray-900">Attributes</h1>
            {attributes.map((attribute, index) => (
                <div key={index}>
                    <div className="flex flex-col gap-y-1 items-start">
                        <div className="flex flex-col">
                            <h2 className="text-sm font-medium text-[#494949]">
                                {`Attribute ${index + 1}`}
                            </h2>
                            <input
                                className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-full"
                                placeholder="e.g. Model Name"
                            />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-medium text-[#494949]">
                                Value
                            </h2>
                            <input
                                className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-full"
                                placeholder="e.g. CNC 1"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttributeInputColumn;
