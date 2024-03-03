"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const NewFactoryForm = () => {

    const [isVisible, setVisibility] = useState(true)
    const [factoryName, setFactoryName] = useState("")
    const [factoryDescription, setFactoryDescription] = useState("")

    return (
        <div className="w-full absolute h-full items-center justify-center m-auto">
            
            {isVisible &&
                <>
                    <form className="w-[50%] h-80 absolute bg-white rounded-3xl shadow-xl z-50 mx-[25%] my-[85%] px-10 items-center justify-center gap-y-5">
                        <Image
                            src="/icons/navbar/close.svg"
                            onClick={() => setVisibility(false)}
                            width={30}
                            height={30}
                            className="select-none absolute right-4 top-4 cursor-pointer -mt-0.5"
                            alt="close icon"
                        />
                        <h1 className="text-DarkBlue text-3xl font-semibold my-8">Provide your factory details</h1>
                        <input
                            type="text"
                            value={factoryName}
                            onChange={(e) => {
                                setFactoryName(e.target.value);
                            }}
                            placeholder="Enter factory name"
                            className="rounded-full w-full pl-8 p-4 my-3 text-lg font-medium text-white placeholder-white dark:text-white bg-gradient-to-br from-MainBlue to-DarkBlue"
                        />
                        <input
                            type="text"
                            value={factoryDescription}
                            onChange={(e) => {
                                setFactoryDescription(e.target.value);
                            }}
                            placeholder="Enter factory description (optional)"
                            className="rounded-full w-full pl-8 p-4 my-3 text-lg font-medium text-white placeholder-white dark:text-white bg-gradient-to-br from-MainBlue to-DarkBlue"
                        />
                    </form>
                    <span className="bg-black/70 fixed w-full h-full z-30 top-0 left-0"/>
                </>
        
            }
            

        </div>
    );
};

export default NewFactoryForm;
