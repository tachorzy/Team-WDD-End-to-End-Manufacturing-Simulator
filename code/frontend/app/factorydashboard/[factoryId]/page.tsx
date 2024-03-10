"use client";

import Header from "@/components/factorydashboard/header";
import Navbar from "@/components/Navbar/Navbar";

export default function FactoryDashboard() {
    return (
        <main className="flex flex-col bg-[#FAFAFA] min-h-screen mx-auto smooth-scroll">
            <div className="flex flex-col bg-[url('/background/Grid.svg')] max-h-1/2 rounded-3xl bg-opacity-[15%]">
                <div className="px-32">
                    <Navbar pageId="Home" />
                    <div className="flex flex-col items-center justify-center gap-y-5 mt-16 mx-auto overflow-hidden max-h-screen">
                        <Header />
                    </div>
                </div>
            </div>
        </main>
    );
}
