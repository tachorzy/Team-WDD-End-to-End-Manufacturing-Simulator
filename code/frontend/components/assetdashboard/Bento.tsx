
import React from "react";
import AssetOverview from "./AssetOverview";
import AssetView from "./AssetView";
import { Asset } from "@/app/types/types";

const Bento = (props: { factoryId: string, asset: Asset }) => {
    const { factoryId, asset } = props;

    return (
        <div
            className="flex flex-col mb-3 gap-y-4"
        >
            <div className="flex flex-row gap-x-4">
                <AssetOverview asset={asset}></AssetOverview>
                <AssetView asset={asset}></AssetView>
            </div>
        </div>
    );
};
export default Bento;
