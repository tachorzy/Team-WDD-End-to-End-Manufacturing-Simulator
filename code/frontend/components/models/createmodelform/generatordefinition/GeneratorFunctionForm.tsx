import React from "react";
import RandomGeneratorForm from "./RandomGeneratorForm";

const GeneratorFunctionForm = (props: {
    propertyIndex: number }) => {
    const { propertyIndex } = props;

    return (
        <div className="flex flex-col gap-y-3 max-h-72">
            <RandomGeneratorForm ></RandomGeneratorForm>
        </div>
    );
};

export default GeneratorFunctionForm;
