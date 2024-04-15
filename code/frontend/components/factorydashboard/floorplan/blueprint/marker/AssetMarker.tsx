import Image from "next/image";
import Draggable from "react-draggable";
import { Asset } from "@/app/api/_utils/types";
import React, { useState,useEffect } from "react";
import MarkerPopups from "./MarkerPopups";
import { DraggableData, DraggableEvent } from "react-draggable";

interface AssetMarkerProps {
    asset: Asset;
}

const AssetMarker: React.FC<AssetMarkerProps> = ({ asset }) => {
    const [isDraggableVisible, setDraggableVisible] = useState(true);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });
    const [isCloseToLeft, setIsCloseToLeft] = useState(true);
    const [floorplanWidth, setFloorplanWidth] = useState(0);
    const handleDelete = () => {
        setShowConfirmDialog(true);
    };

    const confirmDelete = () => {
        setDraggableVisible(false);
        setShowConfirmDialog(false);
    };

    const cancelDelete = () => {
        setShowConfirmDialog(false);
    };

    const handleEdit = () => {
        setShowEditForm(true);
    };

    const closeEditForm = () => {
        setShowEditForm(false);
    };

 
    const handleDraggableClick = () => {
        if (!isDragging) {
            setShowButtons(!showButtons);
        }
    };

    useEffect(() => {
        const floorplan = document.querySelector('.floorplan');
        if (floorplan) {
            setFloorplanWidth(floorplan.getBoundingClientRect().width);
        }
    }, []);

    const handleDrag = (e: DraggableEvent, data: DraggableData) => {
        setShowButtons(false);
        setDeltaPosition({ x: data.x, y: data.y });
        setIsCloseToLeft(data.x < floorplanWidth / 2);
    }


    return (
        
        isDraggableVisible && (
            <Draggable 
            cancel=".no-drag" 
            bounds=".floorplan"
            onStart={() => setIsDragging(true)}
            onStop={() => setIsDragging(false)}
            onDrag={handleDrag}
           
              >
                <div className="group flex flex-col absolute top-0 left-0 z-10 drop-shadow-md items-center">
                    <Image
                        src="/icons/floorplan/asset-marker.svg"
                        width={30}
                        height={30}
                        alt="asset marker icon"
                        onDragStart={(e) => e.preventDefault()}
                        className="select-none hover:cursor-grabbing"
                        onClick={handleDraggableClick}
                    />
                    <p className="shadow-md text-xs group-hover:visible invisible text-center self-center bg-opacity-[40%] px-1 py-0.5 font-medium rounded-sm bg-gray-800 my-1">
                        {asset?.name}
                    </p>
                    {showButtons && (
                        <div className={`absolute ${isCloseToLeft ? 'left-full' : 'right-full'} top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-xl p-6 min-w-max w-96 h-auto flex flex-col justify-between no-drag`}>
                            <div className="">
                                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                                    Asset Info
                                </h2>
                                <h2
                                    className="text-3xl font-semibold mb-2 text-gray-900"
                                    data-testid="name"
                                >
                                    {asset.name}
                                </h2>
                                <p className="text-gray-800">
                                    {asset.description}
                                </p>
                            </div>
                            <div className="self-end"  >
                                <MarkerPopups
                                    handleDelete={handleDelete}
                                    showConfirmDialog={showConfirmDialog}
                                    confirmDelete={confirmDelete}
                                    cancelDelete={cancelDelete}
                                    handleEdit={handleEdit}
                                    showEditForm={showEditForm}
                                    closeEditForm={closeEditForm}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Draggable>
        )
    );
};

export default AssetMarker;