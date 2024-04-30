import React from "react";
import Image from "next/image";

type Attribute = { attribute: string; value: string };
type Property = { property: string; unit: string };

const AddedModelCharacteristic = (props: {
    characteristic: string;
    setCharacteristic:
        | React.Dispatch<React.SetStateAction<[{ attribute: ""; value: "" }]>>
        | React.Dispatch<React.SetStateAction<[{ property: ""; unit: "" }]>>;
}) => {
    const { characteristic, setCharacteristic } = props;

    return (
        <button
            type="button"
            onClick={() => {
                setCharacteristic((prev: Array<Attribute | Property>) =>
                    characteristic === "Attribute"
                        ? [...prev, { attribute: "", value: "" }]
                        : [...prev, { property: "", unit: "" }],
                );
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
                    Add {characteristic}
                </h1>
            </div>
        </button>
    );
};
export default AddedModelCharacteristic;
