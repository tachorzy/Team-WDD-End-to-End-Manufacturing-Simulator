import React, { useState } from "react";

interface AddAssetProps {
    onAdd: (newAsset: Asset) => void;
}

interface Asset {
    id: string;
    name: string;
    description: string;
    image: string;
}

const AddAsset: React.FC<AddAssetProps> = ({ onAdd }) => {
    const [id, setId] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<string>("");

    const handleAddAsset = () => {
        const newAsset: Asset = {
            id,
            name,
            description,
            image,
        };
        onAdd(newAsset);
        setId("");
        setName("");
        setDescription("");
        setImage("");
    };

    return (
        <div className="add-asset-form text-black">
            <input
                type="text"
                placeholder="Asset ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
            />
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="text"
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
            />
            <button type="button" onClick={handleAddAsset}>
                Add Asset
            </button>
        </div>
    );
};

export default AddAsset;
