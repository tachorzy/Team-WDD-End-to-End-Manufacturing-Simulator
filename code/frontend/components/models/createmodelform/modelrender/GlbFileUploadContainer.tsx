import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import ModelViewer from "./ModelViewer";

const GlbFileUploadContainer = () => {
    const [assetModelFile, setAssetModelFile] = useState<File | null>(null);

    const onDrop = React.useCallback((acceptedFiles: File[]) => {
        setAssetModelFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "model/gltf-binary": [".glb"] },
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
                />
                <div>
                    <p className="text-slate-500 text-sm font-medium text-center">
                        Click or drop your .glb model file here to upload.
                    </p>
                </div>
            </div>
            {assetModelFile && <ModelViewer file={assetModelFile} />}
        </section>
    );
};

export default GlbFileUploadContainer;
