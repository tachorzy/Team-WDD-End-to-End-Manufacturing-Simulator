"use client";

import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import SearchModeButton from "./searchbar/SearchModeButton";
interface SearchProps {
    onSearch: (position: { lat: number; lon: number }) => void;
}

const INITIAL_ADDRESS_STATE = "";
const INIITIAL_LATITUDE_STATE = "";
const INITIAL_LONGITUDE_STATE = "";

const Searchbar: React.FC<SearchProps> = ({ onSearch }) => {
    const [isAddressSearchBarActive, setIsAddressSearchBarActive] =
        useState(true);
    const [address, setAddress] = useState(INITIAL_ADDRESS_STATE);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [invalidInput, setInvalidInput] = useState(false);

    const handleSearch = async () => {
        const coordinates = isAddressSearchBarActive
            ? await getCoordinates(address)
            : await getCoodinates(latitude, longitude);
        if (coordinates) {
            onSearch(coordinates);
        }
    };

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

    const getCoodinates = async (
        inputLatitude: string,
        inputLongitude: string,
    ): Promise<{ lat: number; lon: number } | undefined> => {
        try {
            const lat = Number(inputLatitude);
            const lon = Number(inputLongitude);
            console.log(`lat: ${lat}, lon: ${lon}`);
            if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180)
                return { lat, lon };

            setInvalidInput(true);
            return undefined;
            // we should show a tooltip if the latitude and/or longitude are not valid
        } catch (error) {
            return undefined;
        }
    };

    return (
        <div className="mb-8 w-3/4 items-center z-30">
            <div className="flex flex-row gap-x-2 p-2 rounded-full">
                <div className="flex flex-col gap-y-2 w-full">
                    {isAddressSearchBarActive ? (
                        <div>
                            <Image src="/icons/searchbar/search.svg" width={30} height={30} className="absolute float-left justify-center self-center ml-6 mt-5" alt="maginify glass"></Image>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter factory address"
                                className="rounded-full w-full pl-20 p-6 text-xl font-medium text-white placeholder-white dark:text-white bg-gradient-to-br from-MainBlue to-DarkBlue font-medium"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-row gap-x-2">
                            <input
                                type="text"
                                value={latitude}
                                onChange={(e) => {
                                    setLatitude(e.target.value);
                                    setInvalidInput(false);
                                }}
                                placeholder="Enter latitude"
                                className="rounded w-6/12 p-3 text-DarkBlue font-medium"
                            />
                            <input
                                type="text"
                                value={longitude}
                                onChange={(e) => {
                                    setLongitude(e.target.value);
                                    setInvalidInput(false);
                                }}
                                placeholder="Enter longitude"
                                className="rounded w-6/12 p-3 text-DarkBlue font-medium"
                            />
                        </div>
                    )}
                    {/* <SearchModeButton setIsAddressSearchBarActive={setIsAddressSearchBarActive} isAddressSearchBarActive={isAddressSearchBarActive} setInvalidInput={setInvalidInput}/> */}
                </div>

                {address === INITIAL_ADDRESS_STATE &&
                longitude === INIITIAL_LATITUDE_STATE &&
                latitude === INITIAL_LONGITUDE_STATE ? (
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="h-1/2 bg-DarkGray dark:text-white rounded p-3 font-bold inactive border-2 border-[#C5C9D6] border-solid rounded-lg text-[#494949] hover:scale-[101.5%] hover:border-MainBlue"
                    >
                        Search
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="h-1/2 bg-gradient-to-r from-MainBlue to-Iris rounded p-3 font-bold transition-colors duration-700 ease-in ease-out hover:scale-[101.5%] border-2 border-[#C5C9D6] border-solid rounded-lg text-[#494949] hover:scale-[101.5%] hover:border-MainBlue"
                    >
                        Search
                    </button>
                )}
            </div>
            {invalidInput && (
                <span
                    id="invalidCoords"
                    className="flex flex-row gap-x-0.5 text-red-400 font-semibold text-xs mt-0.5"
                >
                    <Image
                        src="/icons/searchbar/map-error.svg"
                        width={25}
                        height={25}
                        alt="error pin"
                    />
                    <p className="pt-0.5">
                        Invalid latitude or longitude provided. Latitude must be
                        between -90° and 90°. Longitude must be between -180°
                        and 180°.
                    </p>
                </span>
            )}
        </div>
    );
};

export default Searchbar;
