import React, { useEffect, useRef, useState } from "react";
import { Attribute } from "@/app/api/_utils/types";
// import ErrorMessage from "@/components/home/searchbar/ErrorMessage";

const AttributeInputColumn = (props: {
    inputFields: Attribute[];
    attributes: Attribute[];
    setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
    modelId: string;
    factoryId: string;
    invalidAttribute: boolean;
    setInvalidAttribute: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const {
        inputFields,
        attributes,
        setAttributes,
        factoryId,
        modelId,
        invalidAttribute,
        setInvalidAttribute,
    } = props;
    const [attribute, setAttribute] = useState("");
    const [value, setValue] = useState("");

    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (attribute === "" || value === "") return;

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            const data: Attribute = {
                factoryId,
                modelId, // later we will create the id from the backend
                name: attribute,
                value,
            };
            console.log(
                `Adding new Attribute named: ${attribute} with value: ${value} to the list of attributes`,
            );
            setAttributes([...attributes, data]);
        }, 500);
    }, [attribute, value, factoryId, attributes, setAttributes]);

    return (
        <div className="flex flex-col gap-y-3 max-h-[22rem] overflow-y-scroll" data-testid="attribute-input">
            <h1 className="text-2xl font-semibold text-gray-900">Attributes</h1>
            {/* <div className="-ml-3 -mt-2 -mb-2">
                {invalidAttribute && (
                    <ErrorMessage
                        message="Please fill out all provided input fields."
                        icon="factory-error.svg"
                    />
                )}
            </div> */}
            {inputFields.map((_, index) => (
                <div key={index}>
                    <div className="flex flex-col gap-y-1 items-start">
                        <div className="flex flex-col">
                            <h2 className="text-sm font-medium text-[#494949]">
                                {`Attribute ${index + 1}`}
                            </h2>
                            <input
                                className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-full"
                                placeholder="e.g. Serial number"
                                onChange={(e) => {
                                    setAttribute(e.target.value);
                                    setInvalidAttribute(false);
                                }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-medium text-[#494949]">
                                Value
                            </h2>
                            <input
                                className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-full"
                                placeholder="e.g. SN-1234567890"
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
