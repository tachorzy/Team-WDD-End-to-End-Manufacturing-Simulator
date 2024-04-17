import React, { useState, useMemo } from "react";
import { Attribute, Property, Measurement ,Asset} from "@/app/api/_utils/types";
import AttributesForm from "./attributedefinition/AttributesForm";
import PropertiesForm from "./propertiesdefinition/PropertiesForm";
import ProgressTracker from "./ProgressTracker";
import GeneratorFunctionForm from "./generatordefinition/GeneratorFunctionForm";

export const Context = React.createContext({});

const CreateModelForm = (props: { factoryId: string }) => {
    const { factoryId } = props;

    
    

    // GENERATE THE ID FROM THE BACKEND!

    const modelId = ""; //REPLACE WITH ACTUAL MODEL ID

    const initialAttribute = {
        factoryId: "",
        modelId: "",
        name: "",
        assetId:"",
        value: "",
    };

    const initialProperty = {
        factoryId: "",
        modelId: "",
        assetId:"",
        measurementId: "",
        name: "",
        unit: "",
        generatorType: "",
    };
    const initialAsset = {
        assetId:"",
        factoryId: "",
        modelId: "",
        name: "",
        description: "",
        modelUrl:"",
    }

    const initialMeasurement = {
        measurementId: "",
        modelId: "",
        factoryId: "",
        lowerBound: 0.0,
        upperBound: 0.0,
        generatorFunction: "",
        frequency: 0,
        precision: 0,
    };

    const [attributes, setAttributes] = useState<Attribute[]>([
        initialAttribute,
    ]);
    const [properties, setProperties] = useState<Property[]>([initialProperty]);
 const[asset,setAsset] = useState<Asset>([initialAsset]);
    const [measurements, setMeasurements] = useState<Measurement[]>([
        initialMeasurement,
    ]);
    const [currentPage, setCurrentPage] = useState(1);

    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);

    const contextValue = useMemo(
        () => ({
            factoryId,
            modelId,
            asset,
            setAsset,
            attributes,
            setAttributes,
            properties,
            setProperties,
            measurements,
            setMeasurements,
            currentPage,
            nextPage,
        }),
        [
            factoryId,
            modelId,
            asset,
            setAsset,
            attributes,
            setAttributes,
            properties,
            setProperties,
            measurements,
            setMeasurements,
            currentPage,
            nextPage,
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
                    <ProgressTracker progress={currentPage} />

                    {currentPage === 1 && <AttributesForm />}
                    {currentPage === 2 && <PropertiesForm />}
                    {currentPage > 2 && <GeneratorFunctionForm />}
                    {currentPage > 1 && (
                        <button
                            type="button"
                            onClick={prevPage}
                            className="bg-black p-2 w-24 rounded-full font-semibold text-lg left-0 bottom-0 absolute mb-4 ml-8"
                        >
                            ‹ Back
                        </button>
                    )}
                </div>
            </div>
        </Context.Provider>
    );
};
export default CreateModelForm;
