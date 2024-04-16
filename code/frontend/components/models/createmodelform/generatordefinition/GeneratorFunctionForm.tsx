import React, { useContext } from "react";
import { Attribute, Property } from "@/app/api/_utils/types";
import RandomGeneratorForm from "./RandomGeneratorForm";
import SineWaveGeneratorForm from "./SineWaveGeneratorForm";
import SawtoothGeneratorForm from "./SawtoothGeneratorForm";
import { Context } from "../CreateModelForm";

interface GeneratorFunctionFormContext {
    factoryId: string;
    modelId: string;
    attributes: { attribute: string; value: string }[];
    setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
    properties: { property: string; unit: string }[];
    setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
    nextPage: () => void;
}

const GeneratorFunctionForm = (props: { propertyIndex: number }) => {
    const { propertyIndex } = props;
    const contextValue = useContext(Context) as GeneratorFunctionFormContext;

    return (
        <div className="flex flex-col gap-y-3 max-h-72">
            <div className="flex flex-row gap-x-16">
                <RandomGeneratorForm propertyIndex={propertyIndex} />
                <SineWaveGeneratorForm propertyIndex={propertyIndex} />
                <SawtoothGeneratorForm propertyIndex={propertyIndex} />
            </div>
            <button
                type="submit"
                onClick={contextValue?.nextPage}
                className="bg-black p-2 w-24 rounded-full font-semibold text-lg right-0 bottom-0 absolute mb-4 mr-8"
            >
                Next ›
            </button>
        </div>
    );
};

export default GeneratorFunctionForm;
