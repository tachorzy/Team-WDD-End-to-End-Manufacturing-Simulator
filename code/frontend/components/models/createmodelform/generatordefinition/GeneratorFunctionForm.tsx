import React from "react";
import RandomGeneratorForm from "./RandomGeneratorForm";
import SineWaveGeneratorForm from "./SineWaveGeneratorForm";
const GeneratorFunctionForm = (props: {
    propertyIndex: number }) => {
    const { propertyIndex } = props;

    return (
        <div className="flex flex-col gap-y-3 max-h-72">
            <div className="flex flex-row gap-x-16">
                <RandomGeneratorForm />
                <SineWaveGeneratorForm/>
            </div>
        </div>
    );
};

export default GeneratorFunctionForm;
