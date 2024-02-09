'use client';
// import font later
import React from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

const geoUrl =
  "https://raw.githubusercontent.com/wingstop-driven-developers/wdd/feature-mapUI/code/manufacturing-sim/public/map/world.json?token=GHSAT0AAAAAACKF25AEZZEVCIKCBJSEUF7MZOGSS3Q"

const Map = () => {

    return(
        <ComposableMap>
            <Geographies geography={geoUrl}>
                {({ geographies }) =>
                    geographies.map(geo => (
                        <Geography
                            key={geo.rsmKey} geography={geo}
                            width="25%"
                            height="25%" 
                            fill="#BDBDBD"
                            stroke="#FFFFFF"
                            className={"hover:fill-[#425EB3] cursor-pointer transition duration-300 ease-in-out transform hover:shadow-lg hover:rounded-lg hover:z-50 hover:opacity-80"}
                        />
                    ))
                }
            </Geographies>
        </ComposableMap>
        // <div className={""}>
        // </div>  
    );
}

export default Map;