"use client";

import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import SearchModeTray from "./SearchModeTray";
import ErrorMessage from "./ErrorMessage";

interface SearchProps {
    onSearch: (position: { lat: number; lon: number }) => void;
    setQueryMade: React.Dispatch<React.SetStateAction<boolean>>;
}

const INITIAL_ADDRESS_STATE = "";
const INITIAL_LATITUDE_STATE = "";
const INITIAL_LONGITUDE_STATE = "";

const Searchbar: React.FC<SearchProps> = ({ onSearch, setQueryMade }) => {
    const [isAddressSearchBarActive, setIsAddressSearchBarActive] =
        useState(true);
    const [address, setAddress] = useState(INITIAL_ADDRESS_STATE);
    const [latitude, setLatitude] = useState(INITIAL_LATITUDE_STATE);
    const [longitude, setLongitude] = useState(INITIAL_LONGITUDE_STATE);
    const [invalidCoords, setInvalidCoords] = useState(false);
    const [invalidAddress, setInvalidAddress] = useState(false);

    interface GeocodeResponse {
        lat: number;
        lon: number;
    }

    const getCoordinates = async (
        inputAddress: string,
    ): Promise<{ lat: number; lon: number } | undefined> => {
        try {
            const response = await axios.get("https://geocode.maps.co/search", {
                params: {
                    q: inputAddress,
                    api_key: process.env.NEXT_PUBLIC_GEOCODE_API_KEY,
                },
            });

            if (Array.isArray(response.data) && response.data.length > 0) {
                const firstResult = response.data[0] as GeocodeResponse;
                const { lat, lon } = firstResult;

                return { lat, lon };
            }

            return undefined;
        } catch (error) {
            return undefined;
        }
    };

    const validateCoordinates = (
        inputLatitude: string,
        inputLongitude: string,
    ): { lat: number; lon: number } | undefined => {
        try {
            const lat = Number(inputLatitude);
            const lon = Number(inputLongitude);

            if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180)
                return { lat, lon };

            setInvalidCoords(true);
            return undefined;
        } catch (error) {
            return undefined;
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const coordinates = isAddressSearchBarActive
            ? await getCoordinates(address)
            : validateCoordinates(latitude, longitude);

        if (coordinates) {
            setQueryMade(true);
            onSearch(coordinates);
        } else if (isAddressSearchBarActive) {
            setInvalidAddress(true);
        } else {
            setInvalidCoords(true);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            method="POST"
            className="w-3/4 items-center justify-center z-30"
        >
            <SearchModeTray
                setIsAddressSearchBarActive={setIsAddressSearchBarActive}
                isAddressSearchBarActive={isAddressSearchBarActive}
                setInvalidCoords={setInvalidCoords}
                setInvalidAddress={setInvalidAddress}
            />
            <div className="flex flex-row p-2 rounded-full">
                <div className="flex flex-col gap-y-2 w-full">
                    {isAddressSearchBarActive ? (
                        <div>
                            <Image
                                src="/icons/searchbar/search.svg"
                                width={30}
                                height={30}
                                className="absolute select-none float-left justify-center self-center ml-6 mt-6"
                                alt="maginify glass"
                            />
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => {
                                    setAddress(e.target.value);
                                    setInvalidAddress(false);
                                }}
                                placeholder="Enter factory address"
                                className="rounded-l-full w-full pl-20 p-6 text-xl font-medium text-white placeholder-white dark:text-white bg-gradient-to-br from-MainBlue to-DarkBlue"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-row">
                            <Image
                                src="/icons/searchbar/search.svg"
                                width={30}
                                height={30}
                                className="absolute select-none float-left justify-center self-center ml-6 mt-0.5"
                                alt="maginify glass"
                            />
                            <div className="flex flex-row gap-x-0 w-full">
                                <input
                                    type="text"
                                    value={latitude}
                                    onChange={(e) => {
                                        setLatitude(e.target.value);
                                        setInvalidCoords(false);
                                    }}
                                    placeholder="Enter latitude"
                                    className="rounded-l-full w-full pl-20 p-6 text-xl font-medium text-white placeholder-white dark:text-white bg-gradient-to-br from-MainBlue to-DarkBlue"
                                />
                                <input
                                    type="text"
                                    value={longitude}
                                    onChange={(e) => {
                                        setLongitude(e.target.value);
                                        setInvalidCoords(false);
                                    }}
                                    placeholder="Enter longitude"
                                    className="w-full pl-20 p-6 pl-5 border-l-[3px] border-white text-xl font-medium text-white placeholder-white dark:text-white bg-gradient-to-bl from-MainBlue to-DarkBlue"
                                />
                            </div>
                        </div>
                    )}
                </div>
                {address === INITIAL_ADDRESS_STATE &&
                longitude === INITIAL_LATITUDE_STATE &&
                latitude === INITIAL_LONGITUDE_STATE ? (
                    <button
                        type="submit"
                        className="disabled rounded-r-full bg-DarkBlue border-l-[3px] border-white dark:text-white p-3 font-bold inactive text-[#494949] hover:border-MainBlue"
                    >
                        Create facility
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="rounded-r-full border-l-[3px] border-white bg-DarkBlue rounded p-3 font-bold transition-colors duration-700 ease-in ease-out"
                    >
                        Create facility
                    </button>
                )}
            </div>
            {invalidCoords && (
                <ErrorMessage
                    message="Invalid latitude or longitude provided. Latitude must be between -90° and 90°. Longitude must be between -180° and 180°."
                    icon="map-error.svg"
                />
            )}
            {invalidAddress && (
                <ErrorMessage
                    message={
                        "We couldn't find the address that you're looking for. Please try again."
                    }
                    icon="map-error.svg"
                />
            )}
        </form>
    );
};

export default Searchbar;
