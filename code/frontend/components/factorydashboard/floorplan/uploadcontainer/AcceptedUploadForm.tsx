import React, { useState } from "react";
import Image from "next/image";
import UploadResultTray from "./UploadResultTray";

const FileUploadContainer = (props: {
    uploadedFile: File;
    setUploadedFile: React.Dispatch<React.SetStateAction<File | null>>;
    acceptedFileItems: React.JSX.Element[];
    fileRejectionItems: React.JSX.Element[];
}) => {
    const {
        uploadedFile,
        setUploadedFile,
        acceptedFileItems,
        fileRejectionItems,
    } = props;
    const [isVisible, setVisibility] = useState(true);

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
                            acceptedFileItems={acceptedFileItems}
                            fileRejectionItems={fileRejectionItems}
                        />
                        <div className="flex flex-row w-[47.5%] gap-x-4">
                            <button
                                type="button"
                                onClick={() => {
                                    // set the uploaded file to the backend and render it.
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
