import React from 'react';

interface TileProps {
  label: string;
  value: number;
}

const Tile: React.FC<TileProps> = ({ label, value }) => {
  return (
    <div className="p-4 text-center float-left w-52 bg-DarkBlue rounded-lg transition-transform transform hover:scale-105 ">
      <div>{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
};

export default Tile;
