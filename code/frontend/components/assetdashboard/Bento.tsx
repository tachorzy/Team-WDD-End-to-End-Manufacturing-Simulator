import React from "react";
import { Asset } from "@/app/types/types";
import AssetOverview from "./AssetOverview";
import AssetView from "./AssetView";

const Bento = (props: {  asset: Asset }) => {
    const { asset } = props;

    return (
        <div className="flex flex-col mb-3 gap-y-4">
            <div className="flex flex-row gap-x-4">
                <AssetOverview asset={asset} />
                <AssetView asset={asset} />
            </div>
        </div>
    );
};
export default Bento;
