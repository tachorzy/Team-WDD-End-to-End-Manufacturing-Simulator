import React, { useContext } from "react";
import {
    Attribute,
    Property,
    Measurement,
    Model,
} from "@/app/api/_utils/types";
import Link from "next/link";
import RandomGeneratorForm from "./RandomGeneratorForm";
import SineWaveGeneratorForm from "./SineWaveGeneratorForm";
import SawtoothGeneratorForm from "./SawtoothGeneratorForm";
import { Context } from "../CreateModelForm";

interface GeneratorFunctionFormContext {
    factoryId: string;
    modelId: string;
    models: Model[];
    setModels: React.Dispatch<React.SetStateAction<Model[]>>;
    attributes: Attribute[];
    setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
    properties: Property[];
    setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
    measurements: Measurement[];
    setMeasurements: React.Dispatch<React.SetStateAction<Measurement[]>>;
    nextPage: () => void;
}

const GeneratorFunctionForm = () => {
    const contextValue = useContext(Context) as GeneratorFunctionFormContext;
    const uniqueNames: Record<string, boolean> = {};

    const uniqueProperties = contextValue.properties.filter((property) => {
        if (!uniqueNames[property.name]) {
            uniqueNames[property.name] = true;
            return true;
        }
        return false;
    });

    const handleModelSubmission = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault();
        const newModel: Model = {
            factoryId: contextValue.factoryId,
            modelId: contextValue.modelId,
            attributes: contextValue.attributes,
            properties: contextValue.properties,
        };
        console.log(`newModel: ${JSON.stringify(newModel)}\n`);
        contextValue.setModels([...contextValue.models, newModel]);
        contextValue.models.forEach((model) => {
            console.log(`\n\nMODEL: ${JSON.stringify(model)}\n`);
        });
    };

    return (
        <div className="flex flex-col gap-y-3 max-h-72">
            <div className="flex flex-col max-h-[28rem] overflow-y-scroll gap-y-1 gap-x-16">
                {uniqueProperties.map((property, index) => (
                    <div key={index}>
                        {property.generatorType === "Random" && (
                            <RandomGeneratorForm
                                propertyIndex={index}
                                property={property}
                                measurements={contextValue?.measurements}
                                setMeasurements={contextValue?.setMeasurements}
                            />
                        )}
                        {property.generatorType === "Sine wave" && (
                            <SineWaveGeneratorForm
                                propertyIndex={index}
                                property={property}
                                measurements={contextValue?.measurements}
                                setMeasurements={contextValue?.setMeasurements}
                            />
                        )}
                        {property.generatorType === "Sawtooth" && (
                            <SawtoothGeneratorForm
                                propertyIndex={index}
                                property={property}
                                measurements={contextValue?.measurements}
                                setMeasurements={contextValue?.setMeasurements}
                            />
                        )}
                    </div>
                ))}
            </div>

            <button
                type="submit"
                onClick={handleModelSubmission}
                className="bg-black p-2 w-24 rounded-full font-semibold text-lg right-0 bottom-0 absolute mb-4 mr-8"
            >
                <Link href={`/factorydashboard/${contextValue?.factoryId}`}>
                    Submit ›
                </Link>
            </button>
        </div>
    );
};

export default GeneratorFunctionForm;
