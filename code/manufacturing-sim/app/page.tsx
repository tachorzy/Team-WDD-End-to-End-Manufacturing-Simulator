'use client';
import React, { useState } from 'react';
import Image from "next/image";
import Dashboard from "../components/Dashboard"
import Navbar from "../components/Navbar/Navbar";

import Map from "../components/Map";
import Searchbar from "../components/Searchbar";


export default function Home() {
  const [positions, setPositions] = useState<Array<{ lat: number, lon: number }>>([]);
  const handleNewLocation = (newPosition: { lat: number, lon: number }) => {
    setPositions((prevPositions) => [...prevPositions, newPosition]);
  };
  
  return(
    <main className="bg-[#FAFAFA] h-screen flex flex-col overflow-hidden px-32">
      <Navbar/>
      <div className="flex flex-col gap-y-4 mt-20">
        <h1 className="font-extrabold text-DarkGray text-7xl w-1/2 mb-1.5">End-to-End<br/>Manufacturing Simulator</h1>
        <Searchbar onSearch={handleNewLocation} />
      </div>
      {/* <div className="w-full max-w-4xl h-96 bg-gray-200 shadow-lg rounded-lg">
        <Map positions={positions} />
      </div> */}

      {/* <Dashboard></Dashboard> */}
    </main>
  );
}
