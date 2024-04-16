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

    return (
        <div className="flex flex-col gap-y-3 max-h-72">
            <div className="flex flex-col max-h-[28rem] overflow-y-scroll gap-y-1 gap-x-16">
                {contextValue?.properties.map((property, index) => (
                    <div key={index}>
                        {property.generatorType === "Random" && (
                            <RandomGeneratorForm
                                propertyIndex={index}
                                property={property}
                            />
                        )}
                        {property.generatorType === "Sine wave" && (
                            <SineWaveGeneratorForm
                                propertyIndex={index}
                                property={property}
                            />
                        )}
                        {property.generatorType === "Sawtooth" && (
                            <SawtoothGeneratorForm
                                propertyIndex={index}
                                property={property}
                            />
                        )}
                    </div>
                ))}
            </div>

            <button
                type="submit"
                className="bg-black p-2 w-24 rounded-full font-semibold text-lg right-0 bottom-0 absolute mb-4 mr-8"
            >
                Submit ›
            </button>
        </div>
    );
};

export default GeneratorFunctionForm;
