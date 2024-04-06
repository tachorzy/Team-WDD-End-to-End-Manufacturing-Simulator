import React,{useEffect,useState} from "react";
import Image from "next/image";
import { Asset } from "@/app/api/_utils/types";

interface AssetBioProps {
    asset?: Asset | undefined;
}

const AssetBio: React.FC<AssetBioProps> = ({ asset }) => {
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        const loadImageData = async () => {
            if (asset && asset.imageData) {
                    const response = await fetch(asset.imageData);
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    setImageSrc(url);
            } else {
                setImageSrc('/icons/floorplan/placeholder-asset.svg');
            }
        };

        loadImageData();
    }, [asset]);

    
   return (
    <div className="self-start mt-4">
        {asset && (
            <div className="flex flex-row gap-x-4">
                <Image
                    src={imageSrc}
                    width={90}
                    height={90}
                    alt="Asset Image"
                    className="self-center"
                />
                <div className="flex flex-col gap-y-1">
                    <p className="text-DarkBlue font-semibold break-words">
                        {asset.name}
                    </p>
                    <p className="text-[#494949] text-xs break-words">
                        Description: {asset.description}
                    </p>
                </div>
            </div>
        )}
    </div>
);
};

export default AssetBio;
