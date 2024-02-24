import React from "react";
import Image from "next/image";
import Link from "next/link";

const SearchModeButton = (props: {isAddressSearchBarActive: boolean, setIsAddressSearchBarActive: React.Dispatch<React.SetStateAction<boolean>>, setInvalidInput: React.Dispatch<React.SetStateAction<boolean>>}) => {
    return (
        <div className="flex flex-row">
            <button
                type="button"
                onClick={() => {
                    props.setIsAddressSearchBarActive(!props.isAddressSearchBarActive);
                    props.setInvalidInput(false);
                }}
                className="flex flex-col group bg-MainBlue dark:text-white rounded p-2.5 w-20 font-bold transition-colors duration-700 ease-in ease-out hover:scale-[101%] items-center"
            >
                <Image
                    src="/icons/searchbar/address.svg"
                    width={25}
                    height={25}
                    alt="switch searchbar"
                    className="group-hover:rotate-180 transform duration-500"
                />
            </button>
            <button
                type="button"
                onClick={() => {
                    props.setIsAddressSearchBarActive(!props.isAddressSearchBarActive);
                    props.setInvalidInput(false);
                }}
                className="flex flex-col group bg-MainBlue dark:text-white rounded p-2.5 w-20 font-bold transition-colors duration-700 ease-in ease-out hover:scale-[101%] items-center"
            >
                <Image
                    src="/icons/searchbar/address.svg"
                    width={25}
                    height={25}
                    alt="switch searchbar"
                    className="group-hover:rotate-180 transform duration-500"
                />
            </button>
        </div>
    );
};

export default SearchModeButton;
