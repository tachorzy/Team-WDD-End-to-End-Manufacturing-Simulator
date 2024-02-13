"use client";
import React, { useState } from "react";
import { CiGlobe } from "react-icons/ci";
import { MdOutlineFactory } from "react-icons/md";
import { GoGear } from "react-icons/go";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

type MenuOption = {
  icon: JSX.Element; 
  text: string;
};

const Navbar = () => {
  const [nav, setNav] = useState<boolean>(false); 

  const menuOptions: MenuOption[] = [
    { icon: <CiGlobe size={25} className="mr-4" />, text: "Home" },
    { icon: <MdOutlineFactory size={25} className="mr-4" />, text: "Sites" },
    { icon: <GoGear size={25} className="mr-4" />, text: "Assets" },
  ];

  return (
    <div className="max-w-[1640px] mx-auto flex justify-between items-center p-4 shadow-sm">
      <div className="flex items-center">
        <div onClick={() => setNav(!nav)} className="cursor-pointer">
          <AiOutlineMenu size={30} />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl px-2">
          Manufacturing Simu<span className="font-bold">SLAY</span>tor
        </h1>
        {nav ? (
          <div className="bg-black/80 fixed w-full h-screen z-10 top-0 left-0"></div>
        ) : (
          ""
        )}
        <div className={nav ? "fixed top-0 left-0 w-[300px] h-screen bg-white z-10 duration-300" : "fixed top-0 left-[-100%] w-[300px] h-screen bg-white z-10 duration-300"}>
          <AiOutlineClose onClick={() => setNav(!nav)} size={30} className="absolute right-4 top-4 cursor-pointer" />
          <h2 className="text-2xl p-4">
            Manufacturing Simu<span className="font-bold">SLAY</span>tor
          </h2>
          <nav>
            <ul className="flex flex-col p-4 text-gray-800">
              {menuOptions.map(({ icon, text }, index) => {
                return (
                  <div key={index} className="py-4">
                    <li className="text-xl flex cursor-pointer w-[50%] rounded-full mx-auto p-2 hover:text-white hover:bg-black">
                      {icon} {text}
                    </li>
                  </div>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
