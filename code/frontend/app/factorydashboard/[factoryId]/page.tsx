"use client";

import { useState } from "react";
import FactoryBio from "@/components/factorydashboard/FactoryBio";
import FactoryPageNavbar from "@/components/Navbar/FactoryPageNavbar";
import FileUploadContainer from "@/components/factorydashboard/floorplan/uploadcontainer/FileUploadContainer";
import { usePathname } from "next/navigation";
import Blueprint from "@/components/factorydashboard/floorplan/uploadcontainer/Blueprint";

export default function FactoryDashboard() {
    const [floorPlanFile, setFloorPlanFile] = useState<File | null>(null);
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
                    <div className="flex flex-col gap-y-5 mt-8 mx-auto overflow-hidden max-h-screen">
                        <FactoryBio factoryId={factoryId} />
                        {floorPlanFile !== null ? (
                            <Blueprint imageFile={floorPlanFile} />
                        ) : (
                            <FileUploadContainer
                                setFloorPlanFile={setFloorPlanFile}
                            />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
