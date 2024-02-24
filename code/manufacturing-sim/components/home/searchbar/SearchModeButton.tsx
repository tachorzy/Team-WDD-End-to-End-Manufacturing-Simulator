import React from "react";
import Image from "next/image";
import Link from "next/link";

const SearchModeButton = (props: {isAddressSearchBarActive: boolean, setIsAddressSearchBarActive: React.Dispatch<React.SetStateAction<boolean>>, setInvalidInput: React.Dispatch<React.SetStateAction<boolean>>}) => {
    
    const addressIcon = props.isAddressSearchBarActive ? "address-white.svg" : "address-blue.svg";
    const coordsIcon = !props.isAddressSearchBarActive ? "compass-white.svg" : "compass-blue.svg";

    return (
        <div className="flex flex-row rounded w-80">
            <button
                type="button"
                onClick={() => {
                    props.setIsAddressSearchBarActive(!props.isAddressSearchBarActive);
                    props.setInvalidInput(false);
                }}
                className={(props.isAddressSearchBarActive ? "bg-MainBlue text-white" : "bg-LightGray text-MainBlue") + " flex flex-row gap-x-1 group rounded-l border-[3px] border-MainBlue p-2.5 h-10 w-1/2 text-sm font-semibold transition-colors duration-700 ease-in ease-out hover:scale-[101%] items-center justify-center"}
            >
                <Image
                    src={`/icons/searchbar/${addressIcon}`}
                    width={22}
                    height={22}
                    alt="switch searchbar"
                    className="group-hover:rotate-180 transform duration-500"
                />
                {"Address"}
            </button>
            <button
                type="button"
                onClick={() => {
                    props.setIsAddressSearchBarActive(!props.isAddressSearchBarActive);
                    props.setInvalidInput(false);
                }}
                className={(!props.isAddressSearchBarActive ? "bg-MainBlue text-white" : "bg-LightGray text-MainBlue") + " flex flex-row gap-x-1 group rounded-r border-[3px] border-MainBlue p-2.5 h-10 w-1/2 text-sm font-semibold transition-colors duration-700 ease-in ease-out hover:scale-[101%] items-center justify-center"}
            >
                <Image
                    src={`/icons/searchbar/${coordsIcon}`}
                    width={22}
                    height={22}
                    alt="switch searchbar"
                    className="group-hover:rotate-180 transform duration-500"
                />
                {"Coordinates"}
            </button>
        </div>
    );
};

export default SearchModeButton;
