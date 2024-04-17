import React, { useRef, useEffect, useState } from "react";
import { Asset } from "@/app/types/types";

interface Props {
    uploadedImageUrl: string;
    assets: Asset[];
    onAssetsChange: (assets: Asset[]) => void;
}
const InteractiveFloorPlan: React.FC<Props> = ({
    uploadedImageUrl,
    assets,
    onAssetsChange,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        const image = new Image();

        image.onload = () => {
            if (canvas && context) {
                canvas.width = image.width;
                canvas.height = image.height;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0);
                assets.forEach((asset) => {
                    context.fillStyle = "rgba(0, 100, 255, 0.5)";
                    context.fillRect(asset.x, asset.y, 50, 50);
                });
            }
        };
        image.src = uploadedImageUrl;
    }, [uploadedImageUrl, assets]);

    const handleDrop = (e: React.DragEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const assetType = e.dataTransfer.getData("text"); // Use this to determine what asset is being placed.
        const rect = canvasRef.current?.getBoundingClientRect();
        const x = e.clientX - (rect?.left ?? 0);
        const y = e.clientY - (rect?.top ?? 0);
        // const newAsset: Asset = { x, y, id: `${Date.now()}`, type: assetType };
        onAssetsChange([...assets, newAsset]);
    };

    const handleDragOver = (e: React.DragEvent<HTMLCanvasElement>) => {
        e.preventDefault();
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{ border: "1px solid black" }}
            />
        </div>
    );
};

export default InteractiveFloorPlan;
