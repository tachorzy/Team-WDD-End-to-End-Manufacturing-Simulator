import React from "react";
import Image from "next/image";
import { Asset } from "@/app/api/_utils/types";

interface EditAssetProps {
    closeEditForm: React.MouseEventHandler<HTMLElement>;
}

const EditAssetForm: React.FC<EditAssetProps> = ({ closeEditForm }) => (
    <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
        data-testid="edit-form"
    >
        <div className=" relative bg-white shadow-lg rounded-xl p-6 w-96">
            <button
                type="button"
                className="absolute top-3 right-3 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                onClick={closeEditForm}
            >
                <Image
                    src="/icons/navbar/close.svg"
                    width={20}
                    height={20}
                    alt="Close icon"
                />
            </button>
            <h1 className="text-3xl font-semibold mb-4 text-gray-900">
                Edit Asset Details
            </h1>
            <div className="mb-4">
                <label htmlFor="name" className="block mb-1 text-gray-800">
                    Asset Name:
                </label>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter asset name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-800 focus:outline-none focus:border-indigo-500 text-gray-900"
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
                    placeholder="Enter asset description"
                    className="w-full px-4 py-2 rounded-lg border border-gray-800 focus:outline-none focus:border-indigo-500 text-gray-900"
                />
            </div>
            <button
                type="button"
                // onClick={handleSaveChanges}
                className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-DarkBlue focus:outline-none"
            >
                Save Changes
            </button>
        </div>
    </div>
);

export default EditAssetForm;
