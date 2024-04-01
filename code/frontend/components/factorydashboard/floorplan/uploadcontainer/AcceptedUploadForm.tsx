import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createFloorplan } from "@/app/api/floorplan/floorplanAPI";
import UploadResultTray from "./UploadResultTray";

const FileUploadContainer = (props: {
    uploadedFile: File;
    setUploadedFile: React.Dispatch<React.SetStateAction<File | null>>;
    acceptedFileItems: React.JSX.Element[];
    fileRejectionItems: React.JSX.Element[];
    setFloorPlanImage: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
    const {
        uploadedFile,
        setUploadedFile,
        acceptedFileItems,
        fileRejectionItems,
        setFloorPlanImage,
    } = props;
    const [isVisible, setVisibility] = useState(true);
    const navigation = usePathname();

    // not sure how to fix the lint error im getting, using a temporary solution: https://github.com/mightyiam/eslint-config-love/issues/217
    // eslint-disable-next-line @typescript-eslint/require-await
    const handleAccept = async () => {
        const factoryId = navigation.split("/")[2];
        if (!uploadedFile || typeof factoryId !== "string") {
            console.error("File or Factory ID is missing.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            console.log(factoryId);
            console.log(uploadedFile);
            const base64Image = reader.result?.toString().split(",")[1];
            if (base64Image) {
                try {
                    await createFloorplan(base64Image, factoryId);
                    setFloorPlanImage(base64Image);
                    console.log("Floor plan uploaded successfully.");
                } catch (error) {
                    console.error("Error uploading floor plan:", error);
                }
            } else {
                console.error("Failed to convert the file to base64.");
            }
        };
        reader.onerror = () =>
            console.error("There was an error reading the file");
        reader.readAsDataURL(uploadedFile);

        setVisibility(false);
        setUploadedFile(null);
    };

    return (
        <div className="w-full absolute h-full items-center justify-center m-auto">
            {isVisible && (
                <>
                    <div className="mx-[18.5rem] w-[36rem] min-h-[27rem] flex flex-col relative bg-white rounded-3xl shadow-xl z-50 px-4 items-center justify-center gap-y-3">
                        <Image
                            src="/icons/navbar/close.svg"
                            onClick={() => {
                                setVisibility(false);
                                setUploadedFile(null);
                            }}
                            width={30}
                            height={30}
                            className="z-50 select-none absolute right-4 top-4 cursor-pointer -mt-0.5"
                            alt="close icon"
                        />
                        {uploadedFile && (
                            <Image
                                width={260}
                                height={260}
                                src={URL.createObjectURL(uploadedFile)}
                                alt="Uploaded content"
                                className="select-none rounded-2xl"
                            />
                        )}
                        <h1 className="text-black text-lg w-[49%] text-center font-semibold">
                            Your floor plan is ready!
                        </h1>
                        <UploadResultTray
                            data-testid="upload-result-tray"
                            acceptedFileItems={acceptedFileItems}
                            fileRejectionItems={fileRejectionItems}
                        />
                        <div className="flex flex-row w-[47.5%] gap-x-4">
                            <button
                                type="button"
                                onClick={() => {
                                    handleAccept();
                                    setVisibility(false);
                                    setUploadedFile(null);
                                }}
                                className="bg-gradient-to-r from-LightBlue to-MainBlue rounded-full w-1/2 h-8 font-semibold hover:scale-[101.5%] transition duration-500 ease-in-out"
                            >
                                Accept
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setVisibility(false);
                                    setUploadedFile(null);
                                }}
                                className="bg-gradient-to-r from-[#FC7978] to-[#E31D1C] rounded-full w-1/2 h-8 font-semibold hover:scale-[101.5%] transition duration-500 ease-in-out"
                            >
                                Deny
                            </button>
                        </div>
                    </div>
                    <span className="bg-black/70 fixed w-full h-full z-30 top-0 left-0" />
                </>
            )}
        </div>
    );
};

export default FileUploadContainer;
