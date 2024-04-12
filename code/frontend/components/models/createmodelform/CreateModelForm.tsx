import React, { useState } from "react";
// import Image from "next/image";
import AttributeInputColumn from "./AttributeInputColumn";
import PropertyInputColumn from "./PropertyInputColumn";
import AddAttributeButton from "./AddAttributeButton";
import AddPropertyButton from "./AddPropertyButton";
import NameField from "./NameField";
// interface CreateModelFormProps {
//     onClose: () => void;
//     onSave: (formData: Partial<Factory>) => void;
// }

const CreateModelForm = (props: { factoryId: string }) => {
    const { factoryId } = props;

    console.log(factoryId);

    const modelId = "2024-04-08-9780";

    const [attributes, setAttributes] = useState([
        { attribute: "", value: "" },
    ]);
    const [properties, setProperties] = useState([{ property: "", unit: "" }]);

    return (
        <div className="items-center justify-center ml-32">
            <div className="relative w-11/12 max-h-11/12 bg-white rounded-xl p-8 px-10 border-2 border-[#D7D9DF]">
                <h1 className="text-3xl font-semibold mb-4 text-gray-900">
                    Create Your Asset Model
                </h1>
                <div className="flex flex-row gap-x-16 mt-6 gap-y-2">
                    <section className="flex flex-col gap-y-3 min-w-max">
                        <NameField modelId={modelId} />
                        <div className="flex flex-col gap-y-3">
                            <AttributeInputColumn attributes={attributes} />
                            <AddAttributeButton setAttributes={setAttributes} />
                        </div>
                    </section>

                    <section className="flex flex-row gap-y-3 gap-x-4">
                        <div className="flex flex-col w-3/4 gap-y-3">
                            <PropertyInputColumn properties={properties} />
                            <AddPropertyButton setProperties={setProperties} />
                        </div>
                    </section>

                    {/* <ModelIdField modelId={modelId} /> */}
                </div>
            </div>
        </div>
    );
};
export default CreateModelForm;
