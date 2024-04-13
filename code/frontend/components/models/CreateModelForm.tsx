import React, { useState } from "react";
import Image from "next/image";
import AddAttributeButton from "./AddAttributeButton";
import AddPropertyButton from "./AddPropertyButton";
// interface CreateModelFormProps {
//     onClose: () => void;
//     onSave: (formData: Partial<Factory>) => void;
// }

const CreateModelForm: React.FC = () => {
    const modelId = "2024-04-08-9780";

    const [attributes, setAttributes] = useState([
        { attribute: "", value: "" },
    ]);
    const [properties, setProperties] = useState([{ property: "", unit: "" }]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="relative w-10/12 h-3/4 bg-white rounded-xl shadow-lg p-8 px-10">
                <h1 className="text-3xl font-semibold mb-4 text-gray-900">
                    Create Your Asset Model
                </h1>
                <div className="flex flex-row gap-x-16 mt-6">
                    <section className="flex flex-col gap-y-3 min-w-max">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Model ID
                        </h1>
                        <div className="flex flex-col gap-y-0.5">
                            <h2 className="text-sm font-medium text-[#494949]">
                                Define ID prefix
                            </h2>
                            <div className="flex flex-row gap-x-1">
                                <input
                                    className="bg-gray-200 p-4 rounded-lg placeholder-gray-400 text-[#494949] w-[6.25rem]"
                                    placeholder="e.g. CNC"
                                />
                                <h2 className="text-lg font-medium text-[#494949] mt-3">{`- ${modelId}`}</h2>
                            </div>
                        </div>
                    </section>

                    <section className="flex flex-row gap-y-3 gap-x-4">
                        <div className="flex flex-col w-1/2 gap-y-3">
                            <div className="flex flex-col gap-y-3 max-h-96 overflow-y-scroll">
                                <h1 className="text-2xl font-semibold text-gray-900">
                                            Attributes
                                </h1>
                                {attributes.map((attribute, index) => (
                                    <div>
                                        <div className="flex flex-row items-start">
                                            <div className="flex flex-col">
                                                <h2 className="text-sm font-medium text-[#494949]">
                                                    {`Attribute ${index+1}`}
                                                </h2>
                                                <input
                                                    className="bg-gray-200 p-4 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                                                    placeholder="e.g. Model Name"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <h2 className="text-sm font-medium text-[#494949]">
                                                    Value
                                                </h2>
                                                <input
                                                    className="bg-gray-200 p-4 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                                                    placeholder="e.g. Model Name"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <AddAttributeButton setAttributes={setAttributes} />
                        </div>
                        <div className="flex flex-col w-1/2 gap-y-3">
                            <div className="flex flex-col gap-y-3 max-h-96 overflow-y-scroll">
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    Properties
                                </h1>
                                {properties.map((property, index) => (
                                    <div className="flex flex-col gap-y-3">
                                        <div className="flex flex-row items-start">
                                            <div className="flex flex-col">
                                                <h2 className="text-sm font-medium text-[#494949]">
                                                    {`Property ${index+1}`}
                                                </h2>
                                                <input
                                                    className="bg-gray-200 p-4 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                                                    placeholder="e.g. Temperature"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <h2 className="text-sm font-medium text-[#494949]">
                                                    Units
                                                </h2>
                                                <input
                                                    className="bg-gray-200 p-4 rounded-lg placeholder-gray-400 text-[#494949] w-11/12"
                                                    placeholder="e.g. °C"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <AddPropertyButton setProperties={setProperties} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
export default CreateModelForm;
