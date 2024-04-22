
import { Asset } from "@/app/types/types";
import React from "react";

const AssetOverview = (props: { asset: Asset }) => {
    const { asset } = props;

    console.log(`asset in BentoBox: ${asset}`)

    return (
        <div
            className="flex flex-col items-center gap-x-2 mb-3 gap-y-2 border-2 border-[#E2E4EA] bg-[#FAFAFA] rounded-lg pt-4 w-80 h-64"
        >
            <h1 className="text-[#494949] text-lg font-medium">Asset Overview</h1>
            <div className="mt-2 gap-y-1">
                <h1 className="font-medium">
                    <span className="text-sm text-[#494949] font-bold">Asset Name:</span> {asset?.name}
                </h1>
                <h1 className="font-medium">
                    <span className="text-sm text-[#494949] font-bold">Model:</span> {asset?.name}
                </h1>
            </div>
        </div>
    );
};
export default AssetOverview;
