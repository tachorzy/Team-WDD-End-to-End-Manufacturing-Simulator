"use client";

import React, { useState } from "react";
import Image from "next/image";
import { createFactory } from "@/app/api/factories/factoryAPI";
import { Factory } from "@/app/types/types";
import ErrorMessage from "./searchbar/ErrorMessage";

interface CreateFactoryResponse {
    factoryId: string;
    message: string;
}
const BASE_URL = process.env.NEXT_PUBLIC_AWS_ENDPOINT;

const NewFactoryForm = (props: {
    latitude: number;
    longitude: number;
    setQueryMade: React.Dispatch<React.SetStateAction<boolean>>;
    onFactorySubmit: (sessionFactory: Factory) => void;
}) => {
    const { latitude, longitude, setQueryMade, onFactorySubmit } = props;
    const [isVisible, setVisibility] = useState(true);
    const [factoryName, setFactoryName] = useState("");
    const [factoryDescription, setFactoryDescription] = useState("");
    const [invalidName, setInvalidName] = useState(false);
    const [invalidDescription, setInvalidDescription] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (factoryName === "" || factoryDescription.length > 200) {
            setInvalidName(factoryName === "");
            setInvalidDescription(factoryDescription.length > 200);
            return;
        }

        const newFactory: Factory = {
            name: factoryName,
            location: {
                // make sure you turn these into floats or else you will get 400 error
                latitude: parseFloat(latitude.toString()),
                longitude: parseFloat(longitude.toString()),
            },
            description: factoryDescription,
        };

        try {
            const response = await fetch(`${BASE_URL}/factories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newFactory),
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to create factory: ${response.statusText}`,
                );
            }
            const responseData =
                (await response.json()) as CreateFactoryResponse;
            const { factoryId } = responseData;
            onFactorySubmit({
                factoryId,
                name: factoryName,
                description: factoryDescription,
                location: { latitude, longitude },
            });
            setQueryMade(false);
            setVisibility(false);
        } catch (error) {
            console.error("Failed to create factory:", error);
        }
    };

    return (
        <div className="w-full absolute h-full items-center justify-center m-auto">
            {isVisible && (
                <>
                    <form
                        onSubmit={handleSubmit}
                        method="POST"
                        className="w-[50%] h-[60%] flex flex-col relative bg-white rounded-3xl shadow-xl z-50 mx-[25%] my-[85%] px-4 items-center justify-center gap-y-6"
                    >
                        <Image
                            src="/icons/navbar/close.svg"
                            onClick={() => setVisibility(false)}
                            width={30}
                            height={30}
                            className="z-50 select-none absolute right-4 top-4 cursor-pointer -mt-0.5"
                            alt="close icon"
                        />
                        <h1 className="text-black text-3xl font-semibold my-3">
                            Provide your factory details
                        </h1>
                        <div className="w-9/12 z-30">
                            <Image
                                src="/icons/navbar/factory.svg"
                                width={30}
                                height={30}
                                className="absolute select-none float-left justify-center self-center ml-6 mt-3.5"
                                alt="maginify glass"
                            />
                            <input
                                type="text"
                                value={factoryName}
                                onChange={(e) => {
                                    setFactoryName(e.target.value);
                                }}
                                placeholder="Enter factory name"
                                // bg-gradient-to-br from-MainBlue to-DarkBlue
                                className="rounded-xl w-full pl-16 p-4 text-lg font-medium text-neutral-600 placeholder-neutral-400 border-[2.5px] border-neutral-300"
                            />
                        </div>
                        <div className="w-9/12 z-30">
                            <Image
                                src="/icons/navbar/factory.svg"
                                width={30}
                                height={30}
                                className="absolute select-none float-left justify-center self-center ml-6 mt-3.5"
                                alt="maginify glass"
                            />
                            <textarea
                                value={factoryDescription}
                                onChange={(e) => {
                                    setFactoryDescription(e.target.value);
                                }}
                                placeholder="Enter factory description (optional)"
                                className="resize-y min-h-20 max-h-36 rounded-xl w-full pl-16 p-4 text-lg font-medium text-neutral-600 placeholder-neutral-400 border-[2.5px] border-neutral-300"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-1/4 rounded-full z-30 bg-gradient-to-br from-DarkGray to-black dark:text-white py-3 px-6 font-bold inactive text-[#494949] hover:scale-[101.5%] transform transition duration-500"
                        >
                            Create
                        </button>
                        <Image
                            src="/branding/Tensor-Cube.svg"
                            width={250}
                            height={250}
                            className="absolute z-10 opacity-5 bottom-0 right-0"
                            alt="tensor branding"
                        />
                        {invalidName && (
                            <ErrorMessage
                                message="Please provide a name for your new facility."
                                icon="factory-error.svg"
                            />
                        )}
                        {invalidDescription && (
                            <ErrorMessage
                                message="Facility description must be no more than 200 characters."
                                icon="factory-error.svg"
                            />
                        )}
                    </form>
                    <span className="bg-black/70 fixed w-full h-full z-30 top-0 left-0" />
                </>
            )}
        </div>
    );
};

export default NewFactoryForm;
