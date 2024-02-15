import React from 'react'
import Tile  from "../Tiles"

const Dashboard: React.FC = () => {
    const tileData =[
        { label: 'Sites', value: 10 },
        { label: 'Gateways', value: 5 },
        { label: 'Assets', value: 100 },
    ]
    
    return (
      <div>
        {tileData.map((tile,index) => (
            <Tile key={index} value={tile.value} label={tile.label} />
        ))}
      </div>
    );
  };
  
export default Dashboard;
  