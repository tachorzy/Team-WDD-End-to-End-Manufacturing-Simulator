'use client';
// import font later
import React from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

const Map = () => {

    return(
        <ComposableMap>
            <Geographies geography={geoUrl}>
                {({ geographies }) =>
                    geographies.map(geo => (
                        <Geography key={geo.rsmKey} geography={geo} />
                    ))
                }
            </Geographies>
        </ComposableMap>
        // <div className={""}>
        // </div>  
    );
}

export default Map;