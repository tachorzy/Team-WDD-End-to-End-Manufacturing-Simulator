"use client";

// import { useState } from "react";
import FactoryPageNavbar from "@/components/Navbar/FactoryPageNavbar";

export default function Page({
    params,
}: {
    params: { factoryId: string; assetId: string };
}) {
    const { factoryId, assetId } = params;

    return (
        <main className="flex flex-col bg-[#FAFAFA] min-h-screen mx-auto smooth-scroll">
            <div className="flex flex-col bg-[url('/background/Grid.svg')] min-h-screen rounded-3xl bg-opacity-[15%]">
                <FactoryPageNavbar pageId="Dashboard" factoryId={factoryId} />
            </div>
        </main>
    );
}
