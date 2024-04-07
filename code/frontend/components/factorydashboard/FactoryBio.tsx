"use client";

import React, { useEffect, useState } from "react";
import { Factory } from "@/app/api/_utils/types";
import Image from "next/image";
import { GetConfig, NextServerConnector } from "@/app/api/_utils/connector";
import EditFactoryForm from "./editFactory";

interface LocationData {
    address: {
        ISO: string;
        city: string;
        country: string;
        country_code: string;
        county: string;
        house_number: string;
        postcode: string;
        road: string;
        state: string;
    };
}

const FactoryBio = (props: { factoryId: string }) => {
    const { factoryId } = props;
    const [factory, setFactory] = useState<Factory | null>(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [locationData, setLocationData] = useState<LocationData | null>(null);

    useEffect(() => {
        const fetchFactory = async () => {
            if (factoryId) {
                try {
                    const config: GetConfig = {
                        resource: "factories",
                        params: {
                            id: factoryId,
                        },
                    };

                    const data = await NextServerConnector.get<Factory>(config);

                    setFactory(data);
                } catch (error) {
                    console.error("Error fetching factory:", error);
                }
            }
        };

        fetchFactory();
    }, [factoryId]);

    const latitude = Number(factory?.location?.latitude);
    const longitude = Number(factory?.location?.longitude);

    useEffect(() => {
        // TODO: move to next/server api
        const fetchLocation = async () => {
            try {
                const response = await fetch(
                    `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${process.env.NEXT_PUBLIC_GEOCODE_API_KEY}`,
                );
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch location: ${response.statusText}`,
                    );
                }
                const data = (await response.json()) as LocationData;
                setLocationData(data);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        if (latitude && longitude) {
            fetchLocation();
        }
    });

    const civilLocation =
        `${locationData?.address?.city ? `${locationData?.address?.city}, ` : ""}` +
        `${locationData?.address?.state ? `${locationData?.address?.state}, ` : ""}` +
        `${locationData?.address?.country ? locationData?.address?.country : ""}`;

    const locationIcon =
        locationData?.address?.country_code !== undefined
            ? `/flags/${locationData?.address?.country_code.toUpperCase()}.svg`
            : "/icons/globe.svg";

    return (
        <div className="lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
                <div className="flex flex-row gap-x-3">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        {factory ? factory.name : "Loading..."}
                    </h2>
                    <button
                        type="button"
                        className="opacity-[75%] inline-flex items-center hover:scale-[101.5%] hover:rotate-[4deg] transform duration-500"
                        onClick={() => setShowEditForm(true)}
                    >
                        <Image
                            src="/icons/edit.svg"
                            width={30}
                            height={30}
                            alt="edit icon"
                            className="select-none"
                        />
                    </button>

                    {showEditForm && (
                        <EditFactoryForm
                            factory={factory}
                            onClose={() => setShowEditForm(false)}
                            onSave={() => setShowEditForm(false)}
                        />
                    )}
                </div>
                <div className="flex flex-row gap-x-2">
                    <div className="mt-1 flex items-center text-sm font-medium text-gray-500 gap-x-1.5">
                        <Image
                            src={locationIcon}
                            width={18}
                            height={18}
                            className="align-bottom"
                            alt={
                                locationIcon.endsWith("globe.svg")
                                    ? "globe icon"
                                    : `flag icon ${locationData?.address?.country_code}`
                            }
                        />
                        {factory ? civilLocation : "Loading..."}
                    </div>
                    <div className="mt-1 flex items-center text-sm font-light text-gray-500">
                        {factory
                            ? `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`
                            : "Loading..."}
                    </div>
                </div>

                <div className="mt-1 flex items-center text-sm text-gray-500">
                    {factory ? factory.description : "Loading..."}
                </div>
            </div>
        </div>
    );
};

export default FactoryBio;
