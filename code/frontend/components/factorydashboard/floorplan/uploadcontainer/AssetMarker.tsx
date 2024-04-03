import Image from "next/image";
import Draggable, {DraggableCore} from "react-draggable";

const AssetMarker = () => {

    return (
        <Draggable>
            <div className="absolute top-0 left-0 z-10">
                <Image
                    src="/icons/floorplan/asset-marker.svg"
                    width={30}
                    height={30}
                    alt="asset marker icon"
                    className="select-none hover:cursor-grabbing"
                />
            </div>
        </Draggable>

    );
};

export default AssetMarker;