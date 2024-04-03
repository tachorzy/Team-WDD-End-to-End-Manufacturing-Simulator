import Image from "next/image";
import AssetMarker from "./AssetMarker";

const Blueprint = (props: { imageFile: File }) => {
    const { imageFile } = props;

    const imageURL = URL.createObjectURL(imageFile);

    return (
        <div className="sticky overflow-hidden max-h-min w-[55%] border-2 border-MainBlue">
            <AssetMarker></AssetMarker>
            <Image
                src={imageURL}
                width={775}
                height={775}
                quality={100}
                alt="upload result tray"
                className="select-none mb-2 z-0"
            />
        </div>
    );
};

export default Blueprint;
