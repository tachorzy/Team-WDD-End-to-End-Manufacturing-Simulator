'use client';
import React, { useState } from 'react';
import Image from "next/image";
import Dashboard from "../components/Dashboard"
import Navbar from "../components/Navbar/Navbar";

import Map from "../components/Map";
import Searchbar from "../components/Searchbar";
import { TypeAnimation } from 'react-type-animation';


export default function Home() {
  const [positions, setPositions] = useState<Array<{ lat: number, lon: number }>>([]);
  const handleNewLocation = (newPosition: { lat: number, lon: number }) => {
    setPositions((prevPositions) => [...prevPositions, newPosition]);
  };
  
  return(
    <main className="bg-[#FAFAFA] h-screen flex flex-col overflow-hidden px-32">
      <Navbar/>
      <div className="grid grid-cols-1 gap-y-4 mt-20">
        <h1 className="font-extrabold text-DarkGray text-4xl md:text-5xl lg:text-6xl xl:text-7xl w-1/2 mb-1.5">End-to-End<br/>Manufacturing Simulator</h1>
        <div className="absolute flex flex-row gap-x-2 mt-[15.5%] w-1/3">
            <Image src="/icons/home/chevron-horizontal.svg" width={15} height={15} alt="chevron" className="relative h-full pt-1.5 select-none"></Image>
            <TypeAnimation
              className={"relative text-DarkBlue/80 text-lg md:text-xl lg:text-2xl xl:text-3xl mb-4"}
              sequence={["We connect your devices to make them smarter.", 1000]}
              cursor={true}
            />   
        </div>
     
      </div>
      {/* <Searchbar onSearch={handleNewLocation} /> */}

      {/* <div className="w-full max-w-4xl h-96 bg-gray-200 shadow-lg rounded-lg">
        <Map positions={positions} />
      </div> */}

      {/* <Dashboard></Dashboard> */}
    </main>
  );
}
