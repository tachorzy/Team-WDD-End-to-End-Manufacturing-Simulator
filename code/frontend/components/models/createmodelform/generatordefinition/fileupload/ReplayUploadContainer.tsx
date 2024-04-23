import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

const ReplayUploadContainer = (props: {
    setInputFile: React.Dispatch<React.SetStateAction<File | null>>;
    setFormData: React.Dispatch<React.SetStateAction<{ csvData: number[] }>>;
}) => {
    const { setInputFile, setFormData } = props;

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setInputFile(acceptedFiles[0]);
            const file = acceptedFiles[0]; // assuming only one file is uploaded
            const reader = new FileReader();
            reader.onloadend = () => {
                const csvString = reader.result as string;
                // Split the CSV data into lines and fields
                const lines = csvString.split("\n");
                const data = lines.map((line) => line.split(",").map(Number));
                setFormData((prevData) => ({
                    ...prevData,
                    csvData: data.flat(), // assuming you want to store the CSV data in your form data
                }));
            };
            reader.readAsText(file);
        },
        [setFormData, setInputFile],
    );

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "text/csv": [],
            // later add support for glb files.
        },
        maxFiles: 1,
        maxSize: 8000000,
        onDrop,
    });

    return (
        <section className="w-[62.5%] h-1/8 flex flex-col gap-y-5">
            <div
                {...getRootProps({ className: "dropzone" })}
                className="group flex flex-row p-4 gap-x-4 gap-y-3 items-center justify-center border-MainBlue hover:border-LightBlue transition duration-700 ease-in border-dashed border-4 rounded-2xl cursor-pointer scale-[100.25%] shadow-sm"
                data-testid="dropzone"
            >
                <input data-testid="drop-input" {...getInputProps()} />
                <Image
                    width={35}
                    height={35}
                    src="/factorydashboard/upload.svg"
                    alt="upload icon"
                    className="group-hover:animate-pulse-slow transition duration-1000 ease-out"
                />
                <div>
                    <p className="text-slate-500 text-sm font-medium text-center">
                        Click or drop your input file here to upload.
                    </p>
                    <em className="text-slate-700 text-sm font-medium text-center">
                        <span className="text-red-400">*</span>Files supported:
                        .csv
                    </em>
                </div>
            </div>
        </section>
    );
};

export default ReplayUploadContainer;
