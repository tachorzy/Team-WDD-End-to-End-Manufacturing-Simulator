import React, { useState, useEffect } from "react";
import { Factory } from "@/app/types/types";
// import { updateFactory } from "@/app/api/factories/factoryAPI";
import Image from "next/image";
import ErrorMessage from "../home/searchbar/ErrorMessage";

interface EditFactoryFormProps {
    factory: Factory | null;
    onClose: () => void;
    onSave: () => void;
}

const EditFactoryForm: React.FC<EditFactoryFormProps> = ({
    factory,
    onClose,
    onSave,
}) => {
    const [formData, setFormData] = useState<Partial<Factory> | null>(null);
    const [invalidName, setInvalidName] = useState(false);
    const [invalidDescription, setInvalidDescription] = useState(false);

    useEffect(() => {
        if (factory) {
            setFormData({ ...factory });
        }
    }, [factory]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
    const BASE_URL = process.env.NEXT_PUBLIC_AWS_ENDPOINT;
    const handleSaveChanges = async () => {
        if (!formData?.name || formData?.name.trim() === "") {
            setInvalidName(true);
            return;
        }

        if (formData?.description && formData.description.length > 200) {
            setInvalidDescription(true);
            return;
        }

        try {
            if (formData && formData.factoryId) {
                // await updateFactory(formData);
                // const response = await fetch(`${BASE_URL}/factories`, {
                //     method: "PUT",
                //     headers: {
                //         "Content-Type": "application/json",
                //     },
                //     body: JSON.stringify(formData),
                // });
                // onSave();
            } else {
                console.error("Factory data is incomplete.");
            }
        } catch (error) {
            console.error("Failed to update factory:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6">
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
                <h1 className="text-3xl font-semibold mb-4">
                    Edit Factory Details
                </h1>
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-1">
                        Factory Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData?.name || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
                        placeholder="Enter factory name"
                    />
                    {invalidName && (
                        <ErrorMessage
                            message="Please provide a name for the factory."
                            icon="factory-error.svg"
                        />
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block mb-1">
                        Factory Description:
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData?.description || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
                        placeholder="Enter factory description (optional)"
                    />
                    {invalidDescription && (
                        <ErrorMessage
                            message="Factory description must be no more than 200 characters."
                            icon="factory-error.svg"
                        />
                    )}
                </div>
                <button
                    type="button"
                    onClick={handleSaveChanges}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-600 focus:outline-none"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};
export default EditFactoryForm;
