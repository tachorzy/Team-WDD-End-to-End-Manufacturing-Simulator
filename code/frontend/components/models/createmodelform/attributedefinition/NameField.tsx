import React, { useState, useEffect } from "react";
import { Attribute } from "@/app/api/_utils/types";

const NameField = (props: {
    modelId: string;
    factoryId: string;
    attributes: Attribute[];
    setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
}) => {
    const { modelId, factoryId, attributes, setAttributes } = props;
    const [name, setName] = useState("");

    useEffect(() => {
        if (name === "") return;

        const data: Attribute = {
            factoryId,
            modelId, // later we will create the id from the backend
            name: "name",
            value: name,
        };
        setAttributes([...attributes, data]);
    }, [name, modelId, factoryId, attributes, setAttributes]);

    return (
        <div className="">
            <h1 className="text-2xl font-semibold text-gray-900">Model Name</h1>
            <div className="flex flex-col gap-y-0.5">
                <div className="flex flex-row gap-x-1">
                    <input
                        id="nameInput"
                        onChange={(e) => setName(e.target.value)}
                        className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-full"
                        placeholder="Enter a model name"
                    />
                </div>
            </div>
        </div>
    );
};

export default NameField;
