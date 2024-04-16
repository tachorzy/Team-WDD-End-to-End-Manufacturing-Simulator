import React, { useContext, useEffect } from "react";
import { Property } from "@/app/api/_utils/types";
import GeneratorFunctionCombobox from "./GeneratorFunctionCombobox";

const PropertyInputColumn = (props: {
    inputFields: Property[];
    properties: Property[];
    setProperties: React.Dispatch<
        React.SetStateAction<Property[]>
    >;
}) => {
    const { inputFields, properties, setProperties } = props;
    const [property, setProperty] = React.useState("")
    const [unit, setUnit] = React.useState("")
    const [generatorFunction, setGeneratorFunction] = React.useState("")

    useEffect(() => {  
        if (property === "" || unit === "" || generatorFunction === "") return

        const data: Property = {
            factoryId: "",
            modelId: "",
            measurementId: "",
            name: property,
            unit: unit,
            generatorType: generatorFunction,   
        }
        console.log(`new property added: ${data.name} with unit: ${data.unit} and generator function: ${data.generatorType}`)
        setProperties([...properties, data])
        console.log(`properties array's size is now ${properties.length}`)
    }, [property, unit, generatorFunction])


    return (
        <div className="flex flex-col gap-y-3 max-h-[19rem] overflow-y-scroll">
            <h1 className="text-2xl font-semibold text-gray-900">Properties</h1>
            {inputFields.map((__, index) => (
                <div key={index} className="flex flex-col gap-y-3">
                    <div className="flex flex-row items-start">
                        <div className="flex flex-col">
                            <h2 className="text-sm font-medium text-[#494949]">
                                {`Property ${index + 1}`}
                            </h2>
                            <input
                                onChange={(e) => setProperty(e.target.value)}
                                className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                                placeholder="e.g. Temperature"
                            />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-medium text-[#494949]">
                                Units
                            </h2>
                            <input
                                onChange={(e) => setUnit(e.target.value)}
                                className="bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                                placeholder="e.g. °C"
                            />
                        </div>
                    </div>
                    <GeneratorFunctionCombobox setGeneratorFunction={setGeneratorFunction}/>
                </div>
            ))}
        </div>
    );
};

export default PropertyInputColumn;
