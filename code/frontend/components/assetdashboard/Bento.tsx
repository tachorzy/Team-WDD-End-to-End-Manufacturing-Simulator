
import React from "react";
import AssetOverview from "./AssetOverview";
import AssetDisplay from "./AssetDisplay";
import { Asset } from "@/app/types/types";

const Bento = (props: { factoryId: string, asset: Asset }) => {
    const { factoryId, asset } = props;

    return (
        <div
            className="flex flex-col gap-x-2 mb-3 gap-y-2"
        >
            <div className="flex flex-row">
                <AssetOverview asset={asset}></AssetOverview>
                <AssetDisplay asset={asset}></AssetDisplay>
            </div>
        </div>
    );
};
export default Bento;
