import Image from "next/image";
import AssetMarker from "./AssetMarker";

const Blueprint = (props: { imageFile: File }) => {
    const { imageFile } = props;

    const imageURL = URL.createObjectURL(imageFile);

    return (
        <div className="sticky overflow-hidden h-min w-[55%]">
            <AssetMarker />
            <Image
                src={imageURL}
                width={775}
                height={775}
                quality={100}
                alt="upload result tray"
                className="select-none z-0"
            />
        </div>
    );
};

export default Blueprint;
