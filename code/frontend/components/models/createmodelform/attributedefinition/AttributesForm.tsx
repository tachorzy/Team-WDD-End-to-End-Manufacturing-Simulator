import React, { useContext } from "react";
// import Image from "next/image";
import AttributeInputColumn from "./AttributeInputColumn";
import AddAttributeButton from "./AddAttributeButton";
import NameField from "./NameField";
import { Context } from "../CreateModelForm";

interface AttributesFormContext {
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

const AttributesForm = () => {
    const contextValue = useContext(Context) as AttributesFormContext;

    return (
        <div className="flex flex-row gap-x-24 mt-6 gap-y-2">
            <section className="flex flex-col gap-y-3 min-w-max">
                <NameField modelId={contextValue?.modelId} />
            </section>

            <section>
                <div className="flex flex-col w-full gap-y-3">
                    <AttributeInputColumn
                        attributes={contextValue?.attributes}
                    />
                    <AddAttributeButton
                        setAttributes={contextValue?.setAttributes}
                    />
                </div>
            </section>
            <section className="flex flex-row w-[30%] gap-y-3 gap-x-4">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-xl font-semibold text-[#494949]">
                        Define your attributes
                    </h1>
                    <p className="text-base font-medium text-[#494949]">
                        <span className="text-MainBlue font-semibold">
                            Attributes
                        </span>{" "}
                        are inherent qualities of a model that remain constant
                        in the simulation. You can define the attributes of your
                        model and asisgn them their values here.
                    </p>
                    <p className="text-base font-medium text-[#494949]">
                        Common attributes include the model's name, serial
                        number and type.
                    </p>
                </div>
            </section>
        </div>
    );
};
export default AttributesForm;
