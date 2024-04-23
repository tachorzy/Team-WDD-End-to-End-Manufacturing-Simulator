"use client";

import { useState } from "react";
import FactoryPageNavbar from "@/components/Navbar/FactoryPageNavbar";
import CreateModelForm from "@/components/models/createmodelform/CreateModelForm";
import ModelTable from "@/components/factorydashboard/ModelTable";

export default function Page({ params }: { params: { factoryId: string } }) {
    const { factoryId } = params;
    const ASSETTABLE_FACTORYID = "factory-1";
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <main className="flex flex-col bg-[#FAFAFA] min-h-screen mx-auto smooth-scroll">
            <div className="flex flex-col bg-[url('/background/Grid.svg')] min-h-screen rounded-3xl bg-opacity-[15%]">
                <FactoryPageNavbar
                    pageId="Asset Models"
                    factoryId={factoryId}
                />

                {/* Extract the code below into a component of its own. */}
                {/* <section className="flex flex-row mt-6 mx-32">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:tracking-tight">
                            {isCreateFormOpen ? "Create asset model" : "Asset Models"}
                    </h2>
                    <div className="flex flex-col ml-[56rem] float-right">                               
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
                                className="absolute mt-20 mx-32"
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
                </section> */}

                {isCreateFormOpen && <CreateModelForm factoryId={factoryId} />}
                <ModelTable factoryId={ASSETTABLE_FACTORYID} />
            </div>
        </main>
    );
}
