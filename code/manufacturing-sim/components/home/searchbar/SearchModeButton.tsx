import React from "react";
import Image from "next/image";
import Link from "next/link";

const SearchModeButton = (props: {isAddressSearchBarActive: boolean, setIsAddressSearchBarActive: React.Dispatch<React.SetStateAction<boolean>>, setInvalidInput: React.Dispatch<React.SetStateAction<boolean>>}) => {
    return (
        <div className="flex flex-row rounded w-64">
            <button
                type="button"
                onClick={() => {
                    props.setIsAddressSearchBarActive(!props.isAddressSearchBarActive);
                    props.setInvalidInput(false);
                }}
                className={(props.isAddressSearchBarActive ? "bg-MainBlue text-white" : "bg-LightGray text-MainBlue") + " flex flex-col group rounded-l border-[3px] border-MainBlue p-2.5 h-10 w-1/2 font-bold transition-colors duration-700 ease-in ease-out hover:scale-[101%] items-center"}
            >
                <Image
                    src="/icons/searchbar/address.svg"
                    width={20}
                    height={20}
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
                className={(!props.isAddressSearchBarActive ? "bg-MainBlue text-white" : "bg-LightGray text-MainBlue") + " flex flex-col group dark:text-white rounded-r border-[3px] border-MainBlue p-2.5 h-10 w-1/2 font-bold transition-colors duration-700 ease-in ease-out hover:scale-[101%] items-center"}
            >
                <Image
                    src="/icons/searchbar/address.svg"
                    width={20}
                    height={20}
                    alt="switch searchbar"
                    className="group-hover:rotate-180 transform duration-500"
                />
            </button>
        </div>
    );
};

export default SearchModeButton;
