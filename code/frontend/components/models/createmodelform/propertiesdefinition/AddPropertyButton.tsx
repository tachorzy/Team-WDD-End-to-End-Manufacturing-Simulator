import React from "react";
import Image from "next/image";
import { Property } from "@/app/api/_utils/types";

const AddPropertyButton = (props: {
    setInputFields: React.Dispatch<React.SetStateAction<Property[]>>;
}) => {
    const { setInputFields } = props;

    const newProperty = {
        factoryId: "",
        modelId: "",
        measurementId: "",
        name: "",
        unit: "",
        generatorType: "",
    };

    return (
        <button
            type="button"
            onClick={() => {
                setInputFields((prev) => [...prev, newProperty]);
            }}
            className="flex flex-row items-center justify-center cursor-pointer w-[91.5%] p-2 border-2 border-dashed border-[#494949] border-solid rounded-lg text-[#494949] hover:scale-[101.5%] hover:border-MainBlue transition duration-500 ease-in-out"
        >
            <div className="flex flex-row" data-testid="add-property">
                <Image
                    src="/icons/add.svg"
                    width={16}
                    height={16}
                    alt="add symbol"
                />
                <h1 className="text-sm font-medium text-[#494949] py-0.5 px-2">
                    Add Property
                </h1>
            </div>
        </button>
    );
};
export default AddPropertyButton;
