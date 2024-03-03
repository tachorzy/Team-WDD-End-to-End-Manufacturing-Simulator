"use client";

import React, { useState } from "react";
import Image from "next/image";

type MenuOption = {
    icon: JSX.Element;
    text: string;
};

const Sidebar = () => {
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
        <div className="flex justify-between align-bottom mt-0.5">
            <span
                onClick={() => setNav(!nav)}
                onKeyDown={(event) => {
                    // TODO: refactor
                    console.log(event);
                }}
                role="button"
                tabIndex={0}
                className="cursor-pointer"
                aria-label="Toggle navigation"
            >
                <Image
                    src="/icons/navbar/hamburger-menu.svg"
                    width={50}
                    height={50}
                    alt="menu icon"
                    className="select-none"
                />
            </span>

            {nav ? (
                <div className="bg-black/70 fixed w-full h-screen z-10 top-0 left-0" />
            ) : (
                ""
            )}

            <div
                className={
                    nav
                        ? "fixed top-0 left-0 w-1/4 h-screen bg-white z-10 duration-300 pt-1.5 z-50"
                        : "fixed top-0 left-[-100%] w-1/4 h-screen bg-white z-10 duration-300 pt-1.5 z-50"
                }
            >
                <Image
                    src="/icons/navbar/close.svg"
                    onClick={() => setNav(!nav)}
                    width={30}
                    height={30}
                    className="select-none absolute right-4 top-4 cursor-pointer mt-2"
                    alt="close icon"
                />
                <Image
                    src="/branding/TensorIoT-Logo-Black.svg"
                    width={150}
                    height={150}
                    alt="brand"
                    className="select-none my-4 ml-14"
                />
                <nav className="flex flex-col mr-12 text-gray-800">
                    {menuOptions.map(({ icon, text }, index) => (
                        <ul key={index} className="py-4">
                            <li className="text-xl flex cursor-pointer max-w-[45%] rounded-3xl mx-auto p-2 hover:text-white hover:bg-black pl-2">
                                {icon} {text}
                            </li>
                        </ul>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
