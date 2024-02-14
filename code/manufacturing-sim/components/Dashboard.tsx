import React from 'react'
import Tile  from "./Tiles"

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
  