import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Asset } from "@/app/api/_utils/types";

const FileUploadContainer = (props: {
    setAssetImageFile: React.Dispatch<React.SetStateAction<File | null>>;
    setFormData: React.Dispatch<React.SetStateAction<Asset>>;
}) => {
    const { setAssetImageFile, setFormData } = props;

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            // call API endpoint that sends the asset image to the backend
            setAssetImageFile(acceptedFiles[0]);
            const file = acceptedFiles[0]; // assuming only one file is uploaded
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result?.toString().split(",")[1];
                // console.log(base64String);
                setFormData((prevData) => ({
                    ...prevData,
                    imageData: base64String as string, // assuming reader.result contains the base64 string of the image
                }));
            };
            reader.readAsDataURL(file);
        },
        [setFormData, setAssetImageFile],
    );

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/svg+xml": [],
            // later add support for glb files.
        },
        maxFiles: 1,
        maxSize: 8000000,
        onDrop,
    });

    return (
        <section className="w-full h-full flex flex-col gap-y-5">
            <div
                {...getRootProps({ className: "dropzone" })}
                className="group flex flex-col w-[62.5%] h-[30rem] p-4 gap-y-3 items-center justify-center border-MainBlue hover:border-LightBlue transition duration-700 ease-in border-dashed border-4 rounded-2xl cursor-pointer scale-[100.25%] shadow-sm"
                data-testid="dropzone"
            >
                <input data-testid="drop-input" {...getInputProps()} />
                <Image
                    width={30}
                    height={30}
                    src="/factorydashboard/upload.svg"
                    alt="upload icon"
                    className="group-hover:animate-pulse-slow transition duration-1000 ease-out"
                />
                <div>
                    <p className="text-slate-500 text-sm font-medium text-center">
                        Click or drop your asset image here to upload.
                    </p>
                    <em className="text-slate-700 text-sm font-medium text-center">
                        <span className="text-red-400">*</span>Files supported:
                        .png, .jpg, .svg, .glb
                    </em>
                </div>
            </div>
        </section>
    );
};

export default FileUploadContainer;
