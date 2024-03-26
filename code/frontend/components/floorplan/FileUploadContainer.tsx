import React from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface DropFile extends File {
    path: string;
}

const FileUploadContainer = () => {
    const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
        useDropzone({
            accept: {
                "image/jpeg": [],
                "image/png": [],
            },
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
        <section className="w-full h-full items-center justify-center">
            <div
                {...getRootProps({ className: "dropzone" })}
                className="group flex flex-col w-[62.5%] h-[30rem] p-10 gap-y-6 items-center justify-center border-MainBlue hover:border-LightBlue transition duration-700 ease-in border-dashed border-4 rounded-2xl cursor-pointer scale-[100.25%] shadow-sm"
            >
                <input {...getInputProps()} />
                <Image
                    width={90}
                    height={90}
                    src="/factorydashboard/upload.svg"
                    alt="upload icon"
                    className="group-hover:animate-pulse-slow transition duration-1000 ease-out"
                />
                <div>
                    <p className="text-slate-500 text-lg font-medium text-center">
                        Click or drop your floor plan file here to upload.
                    </p>
                    <em className="text-slate-700 text-lg font-medium text-center">
                        <span className="text-red-400">*</span>Files supported:
                        .png, .jpg, .svg, .glb
                    </em>
                </div>
            </div>
            <div>
                <h4 className="text-DarkBlue text-sm">Accepted files</h4>
                <ul className="text-DarkBlue text-sm">{acceptedFileItems}</ul>
                <h4 className="text-DarkBlue text-sm">Rejected files</h4>
                <ul className="text-DarkBlue text-sm">{fileRejectionItems}</ul>
            </div>
        </section>
    );
};

export default FileUploadContainer;
