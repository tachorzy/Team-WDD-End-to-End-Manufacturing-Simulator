import React from "react";

interface TileProps {
    label: string;
    value: number;
}

const Tile: React.FC<TileProps> = ({ label, value }) => (
    <div className="p-4 m-4 text-center inline-block float-left w-52 bg-blue-500 rounded-xl transition-transform transform hover:scale-110 ">
        <div>{label}</div>
        <div className="text-2xl font-bold">{value}</div>
    </div>
);

export default Tile;
