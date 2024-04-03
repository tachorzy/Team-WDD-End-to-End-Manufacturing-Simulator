import Image from "next/image";
import React from "react";

const Blueprint = (props: { imageFile: File; assetMarkers: JSX.Element[] }) => {
    const { imageFile, assetMarkers } = props;

    const imageURL = URL.createObjectURL(imageFile);

    return (
        <div className="sticky overflow-hidden h-min w-[55%]">
            <Image
                src={imageURL}
                width={775}
                height={775}
                quality={100}
                alt="floorplan"
                className="select-none z-0"
            />
            {assetMarkers.map((marker, index) =>
                React.cloneElement(marker, { key: index }),
            )}
        </div>
    );
};

export default Blueprint;
