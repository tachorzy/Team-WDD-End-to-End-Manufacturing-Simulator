import React, { useState, useRef, useEffect } from "react";
import { Attribute } from "@/app/api/_utils/types";
import ErrorMessage from "@/components/home/searchbar/ErrorMessage";

const NameField = (props: {
    modelId: string;
    factoryId: string;
    attributes: Attribute[];
    setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
    invalidAttribute: boolean;
    setInvalidAttribute: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const {
        modelId,
        factoryId,
        attributes,
        setAttributes,
        invalidAttribute,
        setInvalidAttribute,
    } = props;
    const [name, setName] = useState("");

    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (name === "") return;

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        const handleData = debounceTimeout.current = setTimeout(() => {
            const data: Attribute = {
                factoryId,
                modelId, // later we will create the id from the backend
                name: "name",
                value: name,
            };
            setAttributes([...attributes, data]);
        }, 500);
        return () => clearTimeout(handleData)
    }, [name, modelId, factoryId, attributes, setAttributes]);

    return (
        <div className="">
            <h1 className="text-2xl font-semibold text-gray-900">Model Name</h1>
            <div className="-ml-3 mb-2">
                {invalidAttribute && (
                    <ErrorMessage
                        message="Model name is required."
                        icon="factory-error.svg"
                    />
                )}
            </div>
            <div className="flex flex-col gap-y-0.5">
                <div className="flex flex-row gap-x-1">
                    <input
                        id="nameInput"
                        onChange={(e) => {
                            setName(e.target.value);
                            setInvalidAttribute(false);
                        }}
                        className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-full"
                        placeholder="Enter a model name"
                    />
                </div>
            </div>
        </div>
    );
};

export default NameField;
