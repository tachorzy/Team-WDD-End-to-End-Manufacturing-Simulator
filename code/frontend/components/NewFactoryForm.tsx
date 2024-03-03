"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const NewFactoryForm = () => {

    const [isVisible, setVisibility] = useState(true)

    return (
        <div className="w-full absolute h-full items-center justify-center m-auto">
            
            {isVisible &&
                <>
                    <div className="w-[50%] h-80 absolute bg-white rounded-3xl shadow-xl z-50 mx-[25%] my-[85%] px-5">
                        <Image
                            src="/icons/navbar/close.svg"
                            onClick={() => setVisibility(false)}
                            width={30}
                            height={30}
                            className="select-none absolute right-4 top-4 cursor-pointer -mt-0.5"
                            alt="close icon"
                        />
                    </div>
                    <span className="bg-black/70 fixed w-full h-full z-30 top-0 left-0"/>
                </>
        
            }
            

        </div>
    );
};

export default NewFactoryForm;
