import React, { useContext } from "react";
import { Attribute, Property } from "@/app/api/_utils/types";
import RandomGeneratorForm from "./RandomGeneratorForm";
import SineWaveGeneratorForm from "./SineWaveGeneratorForm";
import SawtoothGeneratorForm from "./SawtoothGeneratorForm";
import { Context } from "../CreateModelForm";

interface GeneratorFunctionFormContext {
    factoryId: string;
    modelId: string;
    attributes: Attribute[];
    setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
    properties: Property[];
    setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
    nextPage: () => void;
}

const GeneratorFunctionForm = (props: { propertyIndex: number }) => {
    const { propertyIndex } = props;
    const contextValue = useContext(Context) as GeneratorFunctionFormContext;

    // console.log(`properties received in generator function form: ${contextValue?.properties}`)
    // console.log(`propertyIndex received in generator function form: ${propertyIndex}`)
    // console.log(`generator type: ${contextValue?.properties[propertyIndex].generatorType}`)
    return (
        <div className="flex flex-col gap-y-3 max-h-72">
            <div className="flex flex-row gap-x-16">
                {contextValue?.properties[propertyIndex].generatorType == "Random" && ( 
                    <RandomGeneratorForm propertyIndex={propertyIndex} property={contextValue?.properties[propertyIndex]}/>
                )}
                {contextValue?.properties[propertyIndex].generatorType == "Sine wave" && (
                    <SineWaveGeneratorForm propertyIndex={propertyIndex} property={contextValue?.properties[propertyIndex]}/>
                )}
                {contextValue?.properties[propertyIndex].generatorType == "Sawtooth" && (
                    <SawtoothGeneratorForm propertyIndex={propertyIndex} property={contextValue?.properties[propertyIndex]}/>
                )}
            </div>
            {propertyIndex < contextValue?.properties.length - 1 && ( 
                <button
                    type="submit"
                    onClick={contextValue?.nextPage}
                    className="bg-black p-2 w-24 rounded-full font-semibold text-lg right-0 bottom-0 absolute mb-4 mr-8"
                >
                    Next ›
                </button>
            )   }

        </div>
    );
};

export default GeneratorFunctionForm;
