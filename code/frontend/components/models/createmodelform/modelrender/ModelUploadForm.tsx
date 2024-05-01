import React, { useContext, useState, useEffect } from "react";
// import Image from "next/image";
import { Asset } from "@/app/api/_utils/types";
import { BackendConnector } from "@/app/api/_utils/connector";
import Link from "next/link";
import { Context } from "../CreateModelForm";
import GlbFileUploadContainer from "./GlbFileUploadContainer";

export interface ModelUploadFormContext {
    asset: Asset;
    factoryId: string;
    nextPage: () => void;
}
const ModelUploadForm = () => {
    const contextValue = useContext(Context) as ModelUploadFormContext;
    return (
        <div
            className="flex flex-row gap-x-24 mt-4 gap-y-2"
            data-testid="model-upload-form"
        >
            <section className="flex flex-col gap-y-3 min-w-max h-96 pr-20 border-r-2 border-[#D6D6D6] border-opacity-30">
                <GlbFileUploadContainer />
            </section>
            <button
                type="submit"
                className="bg-black text-white p-2 w-24 rounded-full font-semibold text-lg right-0 bottom-0 absolute mb-4 mr-8"
            >
                <Link href={`/factorydashboard/${contextValue?.factoryId}`}>
                    Submit ›
                </Link>
            </button>
        </div>
    );
};
export default ModelUploadForm;
