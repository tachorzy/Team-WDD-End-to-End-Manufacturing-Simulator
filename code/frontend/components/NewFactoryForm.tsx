"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const NewFactoryForm = () => {

    const [isVisible, setVisibility] = useState(true);
    const [factoryName, setFactoryName] = useState("");
    const [factoryDescription, setFactoryDescription] = useState("");

    return (
        <div className="w-full absolute h-full items-center justify-center m-auto">
            
            {isVisible &&
                <>
                    <form className="w-[50%] h-96 flex flex-col absolute bg-white rounded-3xl shadow-xl z-50 mx-[25%] my-[85%] px-4 items-center justify-center gap-y-6">
                        <Image
                            src="/icons/navbar/close.svg"
                            onClick={() => setVisibility(false)}
                            width={30}
                            height={30}
                            className="z-50 select-none absolute right-4 top-4 cursor-pointer -mt-0.5"
                            alt="close icon"
                        />
                       <h1 className="text-black text-3xl font-semibold my-3">Provide your factory details</h1>
                       <div className="w-9/12">
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
                                className="rounded-full w-full pl-16 p-4 text-lg font-medium text-neutral-600 placeholder-neutral-400 bg-neutral-200"
                            />
                       </div>
                       <div className="w-9/12">
                            <Image
                                src="/icons/navbar/factory.svg"
                                width={30}
                                height={30}
                                className="absolute select-none float-left justify-center self-center ml-6 mt-3.5"
                                alt="maginify glass"
                            />
                            <input
                                type="text"
                                value={factoryDescription}
                                onChange={(e) => {
                                    setFactoryDescription(e.target.value);
                                }}
                                placeholder="Enter factory description (optional)"
                                className="rounded-full w-full pl-16 p-4 text-lg font-medium text-neutral-600 placeholder-neutral-400 bg-neutral-200"
                            />
                       </div>
                       <button
                        type="submit"
                        className="w-1/4 rounded-full bg-gradient-to-br from-DarkGray to-black dark:text-white py-3 px-6 font-bold inactive text-[#494949] hover:scale-[101.5%] transform transition duration-500"
                        >
                            Create
                        </button>
                    </form>
                    <span className="bg-black/70 fixed w-full h-full z-30 top-0 left-0"/>
                </>
        
            }
            

        </div>
    );
};

export default NewFactoryForm;
