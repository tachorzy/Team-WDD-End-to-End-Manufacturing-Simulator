import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Asset } from "@/app/types/types";

interface DropFile extends File {
    path: string;
}

const FileUploadContainer = (props: {
    setAssetImageFile: React.Dispatch<React.SetStateAction<File | null>>;
    setFormData: React.Dispatch<React.SetStateAction<Asset>>;
}) => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const { setAssetImageFile, setFormData } = props;

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // call API endpoint that sends the floor-plan to the backend
        setUploadedFile(acceptedFiles[0]);
        setAssetImageFile(acceptedFiles[0]);
        const file = acceptedFiles[0]; // assuming only one file is uploaded
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prevData) => ({
                ...prevData,
                image: reader.result as string, // assuming reader.result contains the base64 string of the image
            }));
        };
        reader.readAsDataURL(file);
    }, [setFormData, setAssetImageFile]);

    const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
        useDropzone({
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

    const acceptedFileItems = (acceptedFiles as DropFile[]).map((file) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={(file as DropFile).path}>
            {(file as DropFile).path} - {file.size} bytes
            <ul>
                {errors.map((e) => (
                    <li key={e.code}>{e.message}</li>
                ))}
            </ul>
        </li>
    ));

    return (
        <section className="w-full h-full flex flex-col gap-y-5">
            <div
                {...getRootProps({ className: "dropzone" })}
                className="group flex flex-col w-[62.5%] h-[30rem] p-4 gap-y-3 items-center justify-center border-MainBlue hover:border-LightBlue transition duration-700 ease-in border-dashed border-4 rounded-2xl cursor-pointer scale-[100.25%] shadow-sm"
            >
                <input {...getInputProps()} />
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
