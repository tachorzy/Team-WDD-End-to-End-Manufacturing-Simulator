"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Dashboard from "../components/dashboard/Dashboard";
import LandingPageTitle from "@/components/home/LandingPageTitle";
import Map from "../components/home/Map.client";
import Searchbar from "../components/home/Searchbar.client";
import Navbar from "../components/Navbar/Navbar";

export default function Home() {
    const [positions, setPositions] = useState<
        Array<{ lat: number; lon: number }>
    >([]);
    const handleNewLocation = (newPosition: { lat: number; lon: number }) => {
        setPositions((prevPositions) => [...prevPositions, newPosition]);
    };

    return (
        <main className="flex flex-col bg-[#FAFAFA] min-h-screen mx-auto smooth-scroll">
            <div className="flex flex-col bg-[url('/background/Grid.svg')] max-h-1/2 rounded-3xl bg-opacity-[15%]">
                <div className="px-32">
                    <Navbar/>
                    <div className="flex flex-col block items-center justify-center gap-y-16 mt-16 mx-auto">
                        <LandingPageTitle />
                        <Link
                            href="#searchbar"
                            className="rounded-full bg-gradient-to-br from-DarkGray via-[#555F68] to-DarkGray opacity-[95%] border-solid border-2 border-neutral-400 p-3 transform transition duration-500 hover:scale-[102.5%] hover:border-MainBlue font-semibold"
                        >
                            Define your industry
                        </Link>
                    </div>
                    <div className="flex flex-col items-center justify-center mt-[50%] gap-y-8">
                        <span
                            id="searchbar"
                            className="flex flex-col w-full items-center justify-center"
                        >
                            <Searchbar onSearch={handleNewLocation} />
                        </span>
                        <div className="w-full max-w-4xl shadow-lg rounded-lg mb-4">
                            <Map positions={positions} />
                        </div>
                        <Dashboard />
                    </div>
                </div>
            </div>
        </main>
    );
}
