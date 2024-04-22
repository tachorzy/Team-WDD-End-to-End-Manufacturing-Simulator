
import { Asset } from "@/app/types/types";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const AssetView = (props: { asset: Asset }) => {
    const { asset } = props;
    const [imageSrc, setImageSrc] = useState("");

    useEffect(() => {
        const loadImageData = async () => {
            if (asset && asset.imageData) {
                const response = await fetch(asset.imageData);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setImageSrc(url);
            } else {
                setImageSrc("/icons/floorplan/placeholder-asset.svg");
            }
        };

        loadImageData();
    }, [asset]);


    return (
        <div
            className="flex flex-col items-center gap-x-2 mb-3 gap-y-2 border-2 border-[#E2E4EA] bg-[#FAFAFA] rounded-lg pt-4 w-80 h-64"
        >
            <h1 className="text-[#494949] text-lg font-medium">Asset View</h1>
            <div className="py-2 p-8 gap-y-1">
                <Image src={imageSrc} width={300} height={300} alt="asset image"></Image>
            </div>
        </div>
    );
};
export default AssetView;
