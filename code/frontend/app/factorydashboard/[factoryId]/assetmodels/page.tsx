"use client";

import FactoryPageNavbar from "@/components/Navbar/FactoryPageNavbar";
import CreateModelForm from "@/components/models/createmodelform/CreateModelForm";

export default function assetModels({
    params,
}: {
    params: { factoryId: string };
}) {
    const { factoryId } = params;

    console.log(`factoryId: ${factoryId}`);

    return (
        <main className="flex flex-col bg-[#FAFAFA] min-h-screen mx-auto smooth-scroll">
            <div className="flex flex-col bg-[url('/background/Grid.svg')] min-h-screen rounded-3xl bg-opacity-[15%]">
                <FactoryPageNavbar
                    pageId="Asset Models"
                    factoryId={factoryId}
                />
                <CreateModelForm />
            </div>
        </main>
    );
}
