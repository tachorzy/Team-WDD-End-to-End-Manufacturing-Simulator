import React from "react";
import Image from "next/image";
import { Attribute } from "@/app/api/_utils/types";

const AddAttributeButton = (props: {
    setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
}) => {
    const { setAttributes } = props;

    const newAttribute = {
        factoryId: "",
        modelId: "",
        name: "",
        value: "",
    };

    return (
        <button
            type="button"
            onClick={() => {
                setAttributes((prev) => [...prev, newAttribute]);
            }}
            className="flex flex-row items-center justify-center cursor-pointer w-[96%] p-2 border-2 border-dashed border-[#494949] border-solid rounded-lg text-[#494949] hover:scale-[101.5%] hover:border-MainBlue transition duration-500 ease-in-out"
        >
            <div className="flex flex-row">
                <Image
                    src="/icons/add.svg"
                    width={16}
                    height={16}
                    alt="add symbol"
                />
                <h1 className="text-sm font-medium text-[#494949] py-0.5 px-2">
                    Add Attribute
                </h1>
            </div>
        </button>
    );
};
export default AddAttributeButton;
