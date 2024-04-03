import React, { useState } from "react";
import { Asset } from "@/app/types/types";
import Image from "next/image";
import AssetUploadContainer from "./AssetUploadContainer";

interface AddAssetFormProps {
    onClose: () => void;
    onAdd: (newAsset: Asset) => void;
}

const AddAssetForm: React.FC<AddAssetFormProps> = ({ onClose, onAdd }) => {
    const [formData, setFormData] = useState<Asset>({
        id: "",
        name: "",
        description: "",
        image: "",
    });
    const [assetImageFile, setAssetImageFile] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddAsset = () => {
        onAdd(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                    <Image
                        src="/icons/navbar/close.svg"
                        width={20}
                        height={20}
                        alt="Close icon"
                    />
                </button>
                <h1 className="text-3xl font-semibold mb-4 text-gray-900">
                    Create Asset Form
                </h1>
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-1 text-gray-800">
                        Asset Name:
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        className="w-full px-4 py-2 rounded-lg border border-gray-800 focus:outline-none focus:border-indigo-500 text-gray-900"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="description"
                        className="block mb-1 text-gray-800"
                    >
                        Description:
                    </label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        className="w-full px-4 py-2 rounded-lg border border-gray-800 focus:outline-none focus:border-indigo-500 text-gray-900"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex flex-row gap-x-0 w-full my-2">
                    <div className="w-80 h-48 ">
                        <AssetUploadContainer setAssetImageFile={setAssetImageFile} setFormData={setFormData}/>
                    </div>
                    <div className="absolute flex flex-col justify-center items-center right-0">
                        <h1 className="text-sm font-medium text-center mr-16">Asset Image Preview:</h1>
                        {assetImageFile && <Image src={URL.createObjectURL(assetImageFile)} width={120} height={120} className="relative right-0 mr-20 mt-12" alt="Asset" />}
                    </div>
                </div>
                {/* <label htmlFor="name" className="block mb-1 text-gray-500">
                Image URL:
        </label>
        <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 text-gray-900"
            onChange={handleInputChange}
        /> */}
                <div>
                    <button
                        type="button"
                        onClick={handleAddAsset}
                        className="inline-flex items-center rounded-md m-2 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50  border border-gray-800"
                    >
                        Create Asset
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center rounded-md m-2 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50  border border-gray-800"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddAssetForm;
