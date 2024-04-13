import React, { useState, useMemo } from "react";
import AttributesForm from "./attributedefinition/AttributesForm";
import ProgressTracker from "./ProgressTracker";
// interface CreateModelFormProps {
//     onClose: () => void;
//     onSave: (formData: Partial<Factory>) => void;
// }

export const Context = React.createContext({});

const CreateModelForm = (props: { factoryId: string }) => {
    const { factoryId } = props;

    console.log(factoryId);

    const modelId = "2024-04-08-9780";

    const [attributes, setAttributes] = useState([
        { attribute: "", value: "" },
    ]);
    const [properties, setProperties] = useState([{ property: "", unit: "" }]);

    const [currentPage, setCurrentPage] = useState(1);

    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);

    const contextValue = useMemo(
        () => ({
            factoryId,
            modelId,
            attributes,
            setAttributes,
            properties,
            setProperties,
        }),
        [
            factoryId,
            modelId,
            attributes,
            setAttributes,
            properties,
            setProperties,
        ],
    );

    return (
        <Context.Provider value={contextValue}>
            <div className="items-center justify-center ml-32">
                <div className="flex flex-row gap-x-[54rem]">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:tracking-tight my-3 mt-6">
                        Create Asset Model
                    </h2>
                    {/* put the exit button here later */}
                </div>

                <div className="relative w-11/12 h-[34rem] bg-white rounded-xl p-8 px-10 border-2 border-[#D7D9DF]">
                    <ProgressTracker />

                    <AttributesForm />
                    {/* <div className="flex flex-row gap-x-16 mt-6 gap-y-2">
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

                    </div> */}
                </div>
            </div>
        </Context.Provider>
    );
};
export default CreateModelForm;
