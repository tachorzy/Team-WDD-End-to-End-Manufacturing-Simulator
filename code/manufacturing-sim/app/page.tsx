'use client';
import React, { useState } from 'react';
import Image from "next/image";
import Map from "../components/Map";
import Searchbar from "../components/Searchbar";

export default function Home() {
  const [positions, setPositions] = useState<Array<{ lat: number, lon: number }>>([]);
  const handleNewLocation = (newPosition: { lat: number, lon: number }) => {
    setPositions((prevPositions) => [...prevPositions, newPosition]);
  };
  
  return(
    <main className="bg-[#FAFAFA] h-screen flex flex-col items-center justify-center">
    <div className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg mb-8">
      <LocationSearch onSearch={handleNewLocation} />
    </div>
    <div className="w-full max-w-4xl h-96 bg-gray-200 shadow-lg rounded-lg">
      <Map positions={positions} />
    </div>
  </main>
  );
}
