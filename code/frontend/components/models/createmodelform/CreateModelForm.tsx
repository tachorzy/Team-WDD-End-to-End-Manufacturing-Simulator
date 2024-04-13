import React, { useState, useMemo } from "react";
import AttributesForm from "./attributedefinition/AttributesForm";
import PropertiesForm from "./propertiesdefinition/PropertiesForm";
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
            currentPage
        }),
        [
            factoryId,
            modelId,
            attributes,
            setAttributes,
            properties,
            setProperties,
            currentPage
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

                    {currentPage === 1 && <AttributesForm />}
                    {currentPage === 2 && <PropertiesForm />}
                    {/* {currentPage > 2 && <AddGeneratorForm propertyIndex={currentPage - 3} />} */}

                    {currentPage > 1 && <button onClick={prevPage} className="bg-black p-2 w-24 rounded-full font-semibold text-lg">Previous</button>}
                    <button onClick={nextPage} className="bg-black p-2 w-24 rounded-full font-semibold text-lg">Next</button>
                </div>
            </div>
        </Context.Provider>
    );
};
export default CreateModelForm;
