'use client';
// import font later
import React from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

const geoUrl =
  "https://raw.githubusercontent.com/wingstop-driven-developers/wdd/feature-mapUI/code/manufacturing-sim/public/map/world.json?token=GHSAT0AAAAAACKF25AEMJODHVXYRMWXXUJ2ZOGUE7Q"

const Map = () => {

    return(
        <div className="w-[60%] bg-stone-100 absolute self-center right-0 bottom-0 xl:mr-32">
            <ComposableMap >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map(geo => (
                            <Geography
                                key={geo.rsmKey} geography={geo}
                                fill="#BDBDBD"
                                stroke="#FFFFFF"
                                className={"hover:fill-[#425EB3] cursor-pointer transition duration-300 ease-in-out transform hover:shadow-lg hover:rounded-lg hover:z-50 hover:opacity-80 stroke-[0.75]"}
                            />
                        ))
                    }
                </Geographies>
            </ComposableMap>
        </div>

        // <div className={""}>
        // </div>  
    );
}

export default Map;