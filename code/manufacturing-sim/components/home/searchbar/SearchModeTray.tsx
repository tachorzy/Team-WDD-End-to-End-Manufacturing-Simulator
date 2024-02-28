import React from "react";
import Image from "next/image";
import Link from "next/link";

const SearchModeTray = (props: {isAddressSearchBarActive: boolean, setIsAddressSearchBarActive: React.Dispatch<React.SetStateAction<boolean>>, setInvalidCoords: React.Dispatch<React.SetStateAction<boolean>>, setInvalidAddress: React.Dispatch<React.SetStateAction<boolean>>}) => {
    
    return (
        <div className="flex flex-row gap-x-16 rounded w-80 items-center justify-center mx-[36%] mt-4 mb-4">
            <div className="group">
                <button
                    type="button"
                    onClick={() => {
                        props.setIsAddressSearchBarActive(!props.isAddressSearchBarActive);
                        props.setInvalidCoords(false);
                        props.setInvalidAddress(false);
                    }}
                    className={(props.isAddressSearchBarActive ? "text-MainBlue" : "text-DarkGray opacity-[60%]") + " flex flex-row gap-x-1 h-10 w-1/2 font-semibold transition-colors duration-700 ease-in ease-out items-center justify-center"}
                >
                    {"Address"}
                </button>
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-MainBlue -ml-4 -mt-2"></span>
            </div>
            <div className="group">
                <button
                    type="button"
                    onClick={() => {
                        props.setIsAddressSearchBarActive(!props.isAddressSearchBarActive);
                        props.setInvalidCoords(false);
                        props.setInvalidAddress(false);
                    }}
                    className={(!props.isAddressSearchBarActive ? "text-MainBlue" : "text-DarkGray opacity-[60%]") + " flex flex-row gap-x-1 h-10 w-1/2 font-semibold transition-colors duration-700 ease-in ease-out items-center justify-center"}
                >
                    {"Coordinates"}
                </button>
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-MainBlue -ml-[1.4rem] -mt-2"></span>
            </div>
        </div>
    );
};

export default SearchModeTray;