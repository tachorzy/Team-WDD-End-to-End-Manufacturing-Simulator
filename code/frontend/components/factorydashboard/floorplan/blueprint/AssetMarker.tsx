import { Asset } from "@/app/types/types";
import Image from "next/image";
import Draggable from "react-draggable";

interface AssetMarkerProps {
    asset: Asset;
}

const AssetMarker: React.FC<AssetMarkerProps> = (props) => {
    const { asset } = props;

    return (
        <Draggable>
            <div className="group flex flex-col absolute top-0 left-0 z-10 drop-shadow-md items-center">
                <Image
                    src="/icons/floorplan/asset-marker.svg"
                    width={30}
                    height={30}
                    alt="asset marker icon"
                    onDragStart={(e) => e.preventDefault()}
                    className="select-none hover:cursor-grabbing"
                />
                <p className="shadow-md text-xs group-hover:visible invisible text-center self-center bg-opacity-[40%] px-1 py-0.5 font-medium rounded-sm bg-gray-800 my-1">
                    {asset?.name}
                </p>
            </div>
        </Draggable>
    );
};

export default AssetMarker;
