
import React from "react";
import AssetOverview from "./AssetOverview";
import AssetDisplay from "./AssetDisplay";
import { Asset } from "@/app/types/types";

const Bento = (props: { factoryId: string, asset: Asset }) => {
    const { factoryId, asset } = props;

    return (
        <div
            className="flex flex-col mb-3 gap-y-4"
        >
            <div className="flex flex-row gap-x-4">
                <AssetOverview asset={asset}></AssetOverview>
                <AssetDisplay asset={asset}></AssetDisplay>
            </div>
        </div>
    );
};
export default Bento;
