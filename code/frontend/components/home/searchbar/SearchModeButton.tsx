import React from "react";
import Image from "next/image";

const SearchModeButton = (props: {
    isAddressSearchBarActive: boolean;
    setIsAddressSearchBarActive: React.Dispatch<React.SetStateAction<boolean>>;
    setInvalidInput: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const {
        isAddressSearchBarActive,
        setIsAddressSearchBarActive,
        setInvalidInput,
    } = props;
    return (
        <div className="flex flex-row rounded w-80">
            <button
                type="button"
                onClick={() => {
                    setIsAddressSearchBarActive(!isAddressSearchBarActive);
                    setInvalidInput(false);
                }}
                className={`${
                    isAddressSearchBarActive
                        ? "bg-MainBlue text-white"
                        : "bg-LightGray text-MainBlue"
                } flex flex-row gap-x-1 group rounded-l border-[3px] border-MainBlue p-2.5 h-10 w-1/2 text-sm font-semibold transition-colors duration-700 ease-in ease-out hover:scale-[101%] items-center justify-center`}
            >
                <Image
                    src="/icons/searchbar/address-white.svg"
                    width={25}
                    height={25}
                    alt="switch searchbar"
                    className="group-hover:rotate-180 transform duration-500"
                />
                Address
            </button>
            <button
                type="button"
                onClick={() => {
                    setIsAddressSearchBarActive(!isAddressSearchBarActive);
                    setInvalidInput(false);
                }}
                className={`${
                    !isAddressSearchBarActive
                        ? "bg-MainBlue text-white"
                        : "bg-LightGray text-MainBlue"
                } flex flex-row gap-x-1 group rounded-r border-[3px] border-MainBlue p-2.5 h-10 w-1/2 text-sm font-semibold transition-colors duration-700 ease-in ease-out hover:scale-[101%] items-center justify-center`}
            >
                <Image
                    src="/icons/searchbar/compass-white.svg"
                    width={25}
                    height={25}
                    alt="switch searchbar"
                    className="group-hover:rotate-180 transform duration-500"
                />
                Coordinates
            </button>
        </div>
    );
};

export default SearchModeButton;
