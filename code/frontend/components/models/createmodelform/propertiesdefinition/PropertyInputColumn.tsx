import React, {  useRef, useEffect } from "react";
import { Property } from "@/app/api/_utils/types";
import ErrorMessage from "@/components/home/searchbar/ErrorMessage";
import GeneratorFunctionCombobox from "./GeneratorFunctionCombobox";

const PropertyInputColumn = (props: {
    inputFields: Property[];
    properties: Property[];
    setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
    invalidProperty: boolean;
    setInvalidProperty: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const {
        inputFields,
        properties,
        setProperties,
        invalidProperty,
        setInvalidProperty,
    } = props;
    const [property, setProperty] = React.useState("");
    const [unit, setUnit] = React.useState("");
    const [generatorFunction, setGeneratorFunction] = React.useState("");

    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (property === "" || unit === "" || generatorFunction === "") return;

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            const data: Property = {
                factoryId: "",
                modelId: "",
                measurementId: "",
                name: property,
                unit,
                generatorType: generatorFunction,
            };

            setProperties([...properties, data]);
        }, 500);
    }, [property, unit, generatorFunction, properties, setProperties]);

    return (
        <div className="flex flex-col gap-y-3 max-h-[19rem] overflow-y-scroll">
            <h1 className="text-2xl font-semibold text-gray-900">Properties</h1>
            <div className="-ml-3 -mt-2 -mb-2">
                {invalidProperty && (
                    <ErrorMessage
                        message="Please fill out all provided input fields."
                        icon="factory-error.svg"
                    />
                )}
            </div>
            {inputFields.map((__, index) => (
                <div key={index} className="flex flex-col gap-y-3">
                    <div className="flex flex-row items-start">
                        <div className="flex flex-col">
                            <h2 className="text-sm font-medium text-[#494949]">
                                {`Property ${index + 1}`}
                            </h2>
                            <input
                                onChange={(e) => {
                                    setProperty(e.target.value);
                                    setInvalidProperty(false);
                                }}
                                className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                                placeholder="e.g. Temperature"
                            />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-medium text-[#494949]">
                                Units
                            </h2>
                            <input
                                onChange={(e) => {
                                    setUnit(e.target.value);
                                    setInvalidProperty(false);
                                }}
                                className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                                placeholder="e.g. °C"
                            />
                        </div>
                    </div>
                    <GeneratorFunctionCombobox
                        setGeneratorFunction={setGeneratorFunction}
                    />
                </div>
            ))}
        </div>
    );
};

export default PropertyInputColumn;
