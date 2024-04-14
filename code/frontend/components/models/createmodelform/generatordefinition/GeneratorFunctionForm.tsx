import React, { useContext } from "react";
import RandomGeneratorForm from "./RandomGeneratorForm";
import SineWaveGeneratorForm from "./SineWaveGeneratorForm";
import SawtoothGeneratorForm from "./SawtoothGeneratorForm";
import { Context } from "../CreateModelForm";

interface GeneratorFunctionFormContext {
    factoryId: string;
    modelId: string;
    attributes: { attribute: string; value: string }[];
    setAttributes: React.Dispatch<
        React.SetStateAction<{ attribute: string; value: string }[]>
    >;
    properties: { property: string; unit: string }[];
    setProperties: React.Dispatch<
        React.SetStateAction<{ property: string; unit: string }[]>
    >;
}

const GeneratorFunctionForm = (props: {
    propertyIndex: number }) => {
    const { propertyIndex } = props;
    const contextValue = useContext(Context) as GeneratorFunctionFormContext;

    return (
        <div className="flex flex-col gap-y-3 max-h-72">
            <div className="flex flex-row gap-x-16">
                <RandomGeneratorForm />
                <SineWaveGeneratorForm/>
                <SawtoothGeneratorForm/>
            </div>
        </div>
    );
};

export default GeneratorFunctionForm;
