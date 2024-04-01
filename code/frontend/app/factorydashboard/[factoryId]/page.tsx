"use client";

import FactoryBio from "@/components/factorydashboard/FactoryBio";
import FactoryPageNavbar from "@/components/Navbar/FactoryPageNavbar";
import FileUploadContainer from "@/components/factorydashboard/floorplan/uploadcontainer/FileUploadContainer";
<<<<<<< HEAD
import AssetInventory from "@/components/factorydashboard/floormanager/AssetInventory";
=======
import { usePathname } from "next/navigation";
>>>>>>> main

export default function FactoryDashboard() {
    // perhaps we can send the factoryId as a prop to the Header component.
    const navigation = usePathname();
    const factoryId = navigation.split("/")[2];

    return (
        <main className="flex flex-col bg-[#FAFAFA] min-h-screen mx-auto smooth-scroll">
            <div className="flex flex-col bg-[url('/background/Grid.svg')] min-h-screen rounded-3xl bg-opacity-[15%]">
                <FactoryPageNavbar
                    pageId="Factory Floor"
                    factoryId={factoryId}
                />
                <div className="px-32">
<<<<<<< HEAD
                    <Navbar pageId="Home" />
                    <div className="flex flex-col items-center justify-center gap-y-5 mt-16 mx-auto overflow-hidden max-h-screen">
                        <Header />
                        <div className="flex justify-between w-full">
                            <FileUploadContainer />
                            <AssetInventory />
                        </div>
=======
                    <div className="flex flex-col gap-y-5 mt-8 mx-auto overflow-hidden max-h-screen">
                        <FactoryBio factoryId={factoryId} />
                        <FileUploadContainer />
>>>>>>> main
                    </div>
                </div>
            </div>
        </main>
    );
}
