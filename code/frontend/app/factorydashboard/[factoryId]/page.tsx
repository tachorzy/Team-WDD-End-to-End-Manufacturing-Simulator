"use client";

import Header from "@/components/factorydashboard/header";
import FactoryPageNavbar from "@/components/Navbar/FactoryPageNavbar";
import FileUploadContainer from "@/components/factorydashboard/floorplan/uploadcontainer/FileUploadContainer";
import { usePathname } from "next/navigation";

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
                    <div className="flex flex-col items-center justify-center gap-y-5 mt-16 mx-auto overflow-hidden max-h-screen">
                        <Header />
                        <FileUploadContainer />
                    </div>
                </div>
            </div>
        </main>
    );
}
