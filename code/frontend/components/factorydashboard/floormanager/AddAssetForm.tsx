import React, { useState } from "react";

interface AddAssetFormProps {
    onClose: () => void;
    onAdd: (newAsset: Asset) => void;
}

interface Asset {
    id: string;
    name: string;
    description: string;
    image: string;
}

const AddAssetForm: React.FC<AddAssetFormProps> = ({ onClose, onAdd }) => {
    const [formData, setFormData] = useState<Asset>({
        id: "",
        name: "",
        description: "",
        image: "",
    });

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
        <div className="add-asset-form-container">
            <div className="text-lg font-semibold mb-4 text-gray-900 bg-blue-400 p-4 rounded-md m-2">
                <h2>Create Asset Form</h2>
                <label htmlFor="name" className="block mb-1 text-gray-800">
                    Asset Name:
                </label>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    className="w-full px-4 py-2 rounded-lg border border-gray-800 focus:outline-none focus:border-indigo-500 text-gray-900 m-2"
                    onChange={handleInputChange}
                />
                <label htmlFor="name" className="block mb-1 text-gray-800">
                    Description:
                </label>
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    className="w-full px-4 py-2 rounded-lg border border-gray-800 focus:outline-none focus:border-indigo-500 text-gray-900 m-2"
                    onChange={handleInputChange}
                />
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
                        Add Asset
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
