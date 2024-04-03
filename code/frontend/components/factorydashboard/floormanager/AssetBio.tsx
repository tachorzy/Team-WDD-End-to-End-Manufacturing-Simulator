import React from "react";
import Image from "next/image";
import { Asset } from "@/app/types/types";

interface AssetBioProps {
    asset?: Asset | undefined;
}

const AssetBio: React.FC<AssetBioProps> = ({ asset }) => (
    <div>
        {asset && ( 
            <div className="flex flex-row gap-x-4">
                <Image
                    src={asset.image as string}
                    width={90}
                    height={90}
                    alt="Asset Image"
                    className="self-center"
                />
                <div className="flex flex-col">
                    <p className="text-xs text-[#494949] font-semibold  break-words">
                        Name: {asset.name}
                    </p>
                    <p className="mt-2 text-[#494949] text-xs break-words">
                        Description: {asset.description}
                    </p>
                </div>
            </div>
        )}
    </div>
);

export default AssetBio;
