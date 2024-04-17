import React, { useContext, useState,useEffect } from "react";
// import Image from "next/image";
import { Attribute, Property,Asset } from "@/app/api/_utils/types";
import AttributeInputColumn from "./AttributeInputColumn";
import AddAttributeButton from "./AddAttributeButton";
import NameField from "./NameField";
import AssetField from "./Assetfield";
import { Context } from "../CreateModelForm";
import {BackendConnector } from "@/app/api/_utils/connector";
import uuid from "react-uuid";

interface AttributesFormContext {
    factoryId: string;
    modelId: string;
    asset:Asset;
    attributes: Attribute[];
    setAsset: React.Dispatch<React.SetStateAction<Asset | undefined>>;
    setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
    properties: { property: string; unit: string }[];
    setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
    nextPage: () => void;
}

 

const AttributesForm = () => {
    const contextValue = useContext(Context) as AttributesFormContext;
    const [inputFields, setInputFields] = useState<Attribute[]>([
        { factoryId: "", modelId: "", name: "", value: "" },
    ]);
    const attributesArray = contextValue.attributes;  
   
 const handleSubmit = async () => {
    const { asset, modelId, attributes } = contextValue
    const attributesMap = new Map();
    attributes.forEach(attr => {
        attributesMap.set(attr.name, attr); 
    });

  

    const addModelAndAttributestoAsset={
        ...asset,
        modelId, // we need to figure out how we are gonna do this without the glb upload
        attributes:attributesMap
        
    };
    console.log(addModelAndAttributestoAsset);
    try{
        const config = await BackendConnector.put<Asset>({
            resource: "assets",
            payload:addModelAndAttributestoAsset,
        });

            
    } catch (e) {
        console.log(e);
    }
        
  }
  const handleNext = async () => {
    contextValue.nextPage(); 
    await handleSubmit();  
    
};

    return (
        <div className="flex flex-row gap-x-24 mt-4 gap-y-2">
            <section className="flex flex-col gap-y-3 min-w-max h-96 pr-20 border-r-2 border-[#D6D6D6] border-opacity-30">
                <AssetField factoryId={contextValue?.factoryId} />

                <NameField
                    modelId={contextValue?.modelId}
                    factoryId={contextValue?.factoryId}
                    attributes={contextValue?.attributes}
                    setAttributes={contextValue?.setAttributes}
                />
            </section>

            <section>
                <div className="flex flex-col w-full gap-y-3">
                    <AttributeInputColumn
                        inputFields={inputFields}
                        attributes={contextValue?.attributes}
                        setAttributes={contextValue?.setAttributes}
                        factoryId={contextValue?.factoryId}
                    />
                    <AddAttributeButton setInputFields={setInputFields} />
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
            <button
                type="submit"
                onClick={handleNext}
                className="bg-black p-2 w-24 rounded-full font-semibold text-lg right-0 bottom-0 absolute mb-4 mr-8"
            >
                Next ›
            </button>
        </div>
    );
};
export default AttributesForm;
