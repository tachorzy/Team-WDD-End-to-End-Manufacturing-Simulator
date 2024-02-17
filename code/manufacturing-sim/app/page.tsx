"use client";

import React, { useState } from "react";
import Image from "next/image";
import Dashboard from "../components/dashboard/Dashboard"
import LandingPageTitle from '@/components/home/LandingPageTitle';
import Map from "../components/home/Map.client";
import Searchbar from "../components/home/Searchbar.client";
import Navbar from "../components/navbar/Navbar";

export default function Home() {
  const [positions, setPositions] = useState<Array<{ lat: number, lon: number }>>([]);
  const handleNewLocation = (newPosition: { lat: number, lon: number }) => {
    setPositions((prevPositions) => [...prevPositions, newPosition]);
  };
  
  return(
    <main className="flex flex-col bg-[#FAFAFA] min-h-screen px-32 mx-auto">
      <Navbar/>
      <div className="flex flex-col block items-center justify-center gap-y-24 mt-16 mx-auto">
        <LandingPageTitle/>
        <Searchbar onSearch={handleNewLocation} />
      </div>

      <div className="flex flex-col">
        <div className="w-full max-w-4xl bg-gray-200 shadow-lg rounded-lg mt-16 mb-4">
          <Map positions={positions} />
        </div>
        <Dashboard></Dashboard>
      </div>
    </main>
  );
}
