"use client";

import { useState } from "react";
import Image from "next/image";
import FactoryPageNavbar from "@/components/Navbar/FactoryPageNavbar";
import CreateModelForm from "@/components/models/createmodelform/CreateModelForm";

export default function assetModels({
    params,
}: {
    params: { factoryId: string };
}) {
    const { factoryId } = params;
    
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);


    return (
        <main className="flex flex-col bg-[#FAFAFA] min-h-screen mx-auto smooth-scroll">
            <div className="flex flex-col bg-[url('/background/Grid.svg')] min-h-screen rounded-3xl bg-opacity-[15%]">
                <FactoryPageNavbar
                    pageId="Asset Models"
                    factoryId={factoryId}
                />
                <section className="mt-6">
                    <div className="flex flex-col gap-x-12 float-right mx-32">
                        <button 
                            type="button"
                            onClick={() => setIsSettingsOpen(true)}
                            className=""
                        >
                            <Image
                                src="/icons/meatball-menu.svg"
                                width={30}
                                height={30}
                                alt="radial background image"
                                className="float-right"
                            />
                        </button>
                        {isSettingsOpen && (
                                <button 
                                    type="button"
                                    onClick={() => setIsCreateFormOpen(true)}
                                    className=""
                                >
                                    <div className="flex flex-row gap-x-2 bg-[#FAFAFA] rounded-lg w-64 h-10 border-2 border-[#C5C9D6] px-4">
                                        <Image 
                                            src="/icons/add.svg"
                                            width={20}
                                            height={20}
                                            alt="add"
                                            className=""
                                        />

                                            <h1 className="my-1.5 text-[#494949] text-base font-medium">
                                                Create asset model
                                            </h1>
                                    </div>
                            </button>
                        )}

                    </div>

                </section>

                {isCreateFormOpen && ( 
                    <CreateModelForm factoryId={factoryId as string}/>
                )}
            </div>
        </main>
    );
}
