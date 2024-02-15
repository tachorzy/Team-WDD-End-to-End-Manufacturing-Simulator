"use client";

import React, { useState } from "react";
import Image from "next/image";
import Dashboard from "../components/Dashboard";

import Map from "../components/Map";
import Searchbar from "../components/Searchbar";

const Navbar = React.lazy(() => import("./components/Navbar.client"));

export default function Home() {
    const [positions, setPositions] = useState<
        Array<{ lat: number; lon: number }>
    >([]);
    const handleNewLocation = (newPosition: { lat: number; lon: number }) => {
        setPositions((prevPositions) => [...prevPositions, newPosition]);
    };

    return (
        <main className="bg-[#FAFAFA] h-screen flex flex-col items-center justify-center">
            <Searchbar onSearch={handleNewLocation} />
            <div className="w-full max-w-4xl h-96 bg-gray-200 shadow-lg rounded-lg">
                <Map positions={positions} />
            </div>

            <Dashboard />
        </main>
    );
}
