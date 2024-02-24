import React, { useState } from "react";

// interface Facility {
//     name: string;
//     address: string;
//     lat: number;
//     lon: number;
//     city: string;
//     state: string;
//     country: string;
//     OEEE: number;
//     lastUpdate: string;
// }

const FactoryTable = () => {

    const STATIC_DATA_REPLACE_LATER = [
        {name: "Facility 1", address: "1234 Main St", lat: 123.456, lon: 123.456, city: "City", state: "State", country: "Country", OEEE: 0.85, lastUpdate: "2022-01-01"},
        {name: "Facility 1", address: "1234 Main St", lat: 123.456, lon: 123.456, city: "City", state: "State", country: "Country", OEEE: 0.85, lastUpdate: "2022-01-01"},
        {name: "Facility 1", address: "1234 Main St", lat: 123.456, lon: 123.456, city: "City", state: "State", country: "Country", OEEE: 0.85, lastUpdate: "2022-01-01"},
        {name: "Facility 1", address: "1234 Main St", lat: 123.456, lon: 123.456, city: "City", state: "State", country: "Country", OEEE: 0.85, lastUpdate: "2022-01-01"},
        {name: "Facility 1", address: "1234 Main St", lat: 123.456, lon: 123.456, city: "City", state: "State", country: "Country", OEEE: 0.85, lastUpdate: "2022-01-01"}
    ] 

    const [facilities, setFacilities] = useState(STATIC_DATA_REPLACE_LATER);

    //useEffect to fetch data from the backend will go here.


    const tableHeaders = [
        "Facility Name",
        "Address",
        "Latitude",
        "Longitude",
        "City",
        "State/Province/Region",
        "Country",
        "OEEE",
        "Lastest Update"
    ];  
    
    return (
    <div className="flex flex-col items-center justify-center mx-auto z-30">
        <table className="table-auto w-10/12 text-center mb-4 rounded-3xl">
            <thead className="text-[#858A8F] font-medium text-sm border-b-2 border-[#858A8F] border-opacity-[70%]">
                <tr className="rounded-3xl">
                    {tableHeaders.map((header) => (
                            <th scope="col" className="px-4 py-2.5">{header}</th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
            {facilities.length > 0 ? (
                <>
                    {facilities.map((facility) => (
                        <tr className="flex-grow text-sm text-[#858A8F]">
                            <td className="border px-4 py-2.5">{facility.name}</td>
                            <td className="border px-4 py-2.5">{facility.address}</td>
                            <td className="border px-4 py-2.5">{facility.lat}</td>
                            <td className="border px-4 py-2.5">{facility.lon}</td>
                            <td className="border px-4 py-2.5">{facility.city}</td>
                            <td className="border px-4 py-2.5">{facility.state}</td>
                            <td className="border px-4 py-2.5">{facility.country}</td>
                            <td className="border px-4 py-2.5">{facility.OEEE}</td>
                            <td className="border px-4 py-2.5">{facility.lastUpdate}</td>
                        </tr>
                        
                    ))}
                </>    
            
            ) : (
                <tr className="flex-grow">
                    <td className="border px-4 py-2 h-60 text-lg text-gray-400" colSpan={9}><i>No Facilities Found</i></td>
                </tr>
            )
            }
            </tbody>
        </table>
    </div>
)};

export default FactoryTable;
