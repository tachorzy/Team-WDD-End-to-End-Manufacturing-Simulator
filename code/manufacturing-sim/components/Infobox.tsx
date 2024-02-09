import React from 'react';

interface TileProps {
  label: string;
  value: number;
}

const Tile: React.FC<TileProps> = ({ label, value }) => {
  return (
    <div className="p-4 m-4 text-center inline-block float-left w-52 bg-blue-500">
      <div>{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div>
      <Tile value={10} label="Sites" />
      <Tile value={5} label="Gateways" />
      <Tile value={100} label="Assets" />
    </div>
  );
};

export default Dashboard;
