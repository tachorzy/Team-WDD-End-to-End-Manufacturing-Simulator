"use client";

import React, { useState } from "react";
import Image from "next/image";

type MenuOption = {
    icon: JSX.Element;
    text: string;
};

const Navbar = () => {
    const [nav, setNav] = useState<boolean>(false);

    const menuOptions: MenuOption[] = [
        {
            icon: (
                <Image
                    src="/icons/navbar/globe.svg"
                    width={25}
                    height={25}
                    className="mr-4 select-none"
                    alt="globe icon"
                />
            ),
            text: "Home",
        },
        {
            icon: (
                <Image
                    src="icons/navbar/factory.svg"
                    width={26}
                    height={26}
                    className="mr-4 select-none"
                    alt="factory icon"
                />
            ),
            text: "Sites",
        },
        {
            icon: (
                <Image
                    src="icons/navbar/cog.svg"
                    width={25}
                    height={25}
                    className="mr-4 select-none"
                    alt="cog icon"
                />
            ),
            text: "Assets",
        },
    ];

    return (
        <div className="max-w-[1640px] mx-auto flex justify-between items-center p-4 shadow-sm">
            <div className="flex items-center">
                <div onClick={() => setNav(!nav)} className="cursor-pointer">
                    <Image
                        src="/icons/navbar/hamburger-menu.svg"
                        width={30}
                        height={30}
                        alt="menu icon"
                    />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl px-2">
                    Manufacturing Simu<span className="font-bold">SLAY</span>tor
                </h1>
                {nav ? (
                    <div className="bg-black/80 fixed w-full h-screen z-10 top-0 left-0" />
                ) : (
                    ""
                )}
                <div
                    className={
                        nav
                            ? "fixed top-0 left-0 w-[300px] h-screen bg-white z-10 duration-300"
                            : "fixed top-0 left-[-100%] w-[300px] h-screen bg-white z-10 duration-300"
                    }
                >
                    <Image
                        src="/icons/navbar/close.svg"
                        onClick={() => setNav(!nav)}
                        width={30}
                        height={30}
                        className="absolute right-4 top-4 cursor-pointer"
                        alt="close icon"
                    />
                    <h2 className="text-2xl p-4">
                        Manufacturing Simu
                        <span className="font-bold">SLAY</span>tor
                    </h2>
                    <nav>
                        <ul className="flex flex-col p-4 text-gray-800">
                            {menuOptions.map(({ icon, text }, index) => (
                                <div key={index} className="py-4">
                                    <li className="text-xl flex cursor-pointer w-[50%] rounded-full mx-auto p-2 hover:text-white hover:bg-black">
                                        {icon} {text}
                                    </li>
                                </div>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
