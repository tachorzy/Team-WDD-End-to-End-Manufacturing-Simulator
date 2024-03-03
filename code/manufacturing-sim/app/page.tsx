"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Dashboard from "../components/dashboard/Dashboard";
import LandingPageTitle from "@/components/home/LandingPageTitle";
import Map from "../components/home/Map.client";
import Searchbar from "../components/home/Searchbar.client";
import Navbar from "../components/Navbar/Navbar";
import FactoryTable from "@/components/home/FactoryTable.client";

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
                    <Navbar pageId="Home" />
                    <div className="flex flex-col block items-center justify-center gap-y-5 mt-16 mx-auto overflow-hidden max-h-screen">
                        <LandingPageTitle />
                        <Image
                            src="/background/radial.svg"
                            width={800}
                            height={800}
                            alt="radial background image"
                            className="absolute z-0 mt-[85%] "
                        />
                        <Link
                            href="#searchbar"
                            className="rounded-full bg-gradient-to-br from-DarkGray via-[#555F68] to-DarkGray opacity-[95%] border-solid border-2 border-neutral-400 p-3 transform transition duration-500 hover:scale-[102.5%] hover:border-MainBlue font-semibold"
                        >
                            Define your industry
                        </Link>
                    </div>
                    <div className="flex flex-col w-full items-center justify-center mt-[80%] gap-y-8">
                        <span
                            id="searchbar"
                            className="flex flex-col w-full items-center justify-center"
                        >
                            <Searchbar onSearch={handleNewLocation} />
                        </span>
                        <div className="w-full rounded-full mb-4">
                            <h1 className="mx-24 mb-0.5 text-DarkBlue text-3xl font-semibold">
                                Recent Factories
                            </h1>
                            <FactoryTable />
                            <Map positions={positions} />
                        </div>
                        {/* <Dashboard /> */}
                    </div>
                </div>
            </div>
        </main>
    );
}
