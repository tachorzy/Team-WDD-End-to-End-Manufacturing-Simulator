'use client';
import React, { useState } from 'react';
import Image from "next/image";
import Dashboard from "../components/dashboard/Dashboard"
import Navbar from "../components/navbar/Navbar";
import LandingPageTitle from '@/components/home/LandingPageTitle';
import Map from "../components/home/Map";
import Searchbar from "../components/home/Searchbar";


export default function Home() {
  const [positions, setPositions] = useState<Array<{ lat: number, lon: number }>>([]);
  const handleNewLocation = (newPosition: { lat: number, lon: number }) => {
    setPositions((prevPositions) => [...prevPositions, newPosition]);
  };
  
  return(
    <main className="bg-[#FAFAFA] min=h-screen flex flex-col px-32">
      <Navbar/>
      <div className="grid grid-cols-1 gap-y-24 mt-20">
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
