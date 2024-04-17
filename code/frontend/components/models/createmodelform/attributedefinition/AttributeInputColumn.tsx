import React, { useEffect, useState } from "react";
import { Attribute } from "@/app/api/_utils/types";

const AttributeInputColumn = (props: {
    inputFields: Attribute[];
    attributes: Attribute[];
    setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
    factoryId: string;
}) => {
    const { inputFields, attributes, setAttributes, factoryId } = props;
    const [attribute, setAttribute] = useState("");
    const [value, setValue] = useState("");

    useEffect(() => {
        if (attribute === "" || value === "") return;
    
        const data: Attribute = {
            factoryId,
            modelId: "123456",
            name: attribute,
            value,
        };
        console.log(`Adding new Attribute named: ${attribute} with value: ${value}`);
        setAttributes(prevAttributes => [...prevAttributes, data]);
    }, [attribute, value, factoryId, setAttributes]);
    return (
        <div className="flex flex-col gap-y-3 max-h-[22rem] overflow-y-scroll">
            <h1 className="text-2xl font-semibold text-gray-900">Attributes</h1>
            {inputFields.map((_, index) => (
                <div key={index}>
                    <div className="flex flex-col gap-y-1 items-start">
                        <div className="flex flex-col">
                            <h2 className="text-sm font-medium text-[#494949]">
                                {`Attribute ${index + 1}`}
                            </h2>
                            <input
                                className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-full"
                                placeholder="e.g. Model Name"
                                onChange={(e) => setAttribute(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-medium text-[#494949]">
                                Value
                            </h2>
                            <input
                                className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-full"
                                placeholder="e.g. CNC 1"
                                onChange={(e) => setValue(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttributeInputColumn;
