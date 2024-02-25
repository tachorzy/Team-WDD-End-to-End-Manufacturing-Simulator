"use client";

import React, { useState } from "react";
import Link from "next/link";

const FactoryTable = () => {

    const STATIC_DATA_REPLACE_LATER = [
        {name: "Facility 11", address: "1234 Main St", lat: 123.456, lon: 123.456, city: "City", state: "State", country: "Country", OEEE: 0.85, lastUpdate: "2022-01-01"},
        {name: "Facility 4", address: "3232 Main St", lat: 123.456, lon: 123.456, city: "City", state: "State", country: "Country", OEEE: 0.85, lastUpdate: "2022-01-01"},
        {name: "Facility 1", address: "2234 Main St", lat: 123.456, lon: 123.456, city: "City", state: "State", country: "Country", OEEE: 0.85, lastUpdate: "2022-01-01"},
        {name: "Facility 0", address: "4234 Main St", lat: 123.456, lon: 123.456, city: "City", state: "State", country: "Country", OEEE: 0.85, lastUpdate: "2022-01-01"},
        {name: "Facility 1", address: "5234 Main St", lat: 123.456, lon: 123.456, city: "City", state: "State", country: "Country", OEEE: 0.85, lastUpdate: "2022-01-01"}
    ] 

    const [facilities, setFacilities] = useState(STATIC_DATA_REPLACE_LATER);
    const [sort, setSort] = useState({ key: "name", direction: "name" });
    //useEffect to fetch data from the backend will go here.

    const tableHeaders = [
        { id: "name", label: "Facility Name" },
        { id: "address", label: "Address" },
        { id: "lat", label: "Latitude" },
        { id: "lon", label: "Longitude" },
        { id: "city", label: "City" },
        { id: "state", label: "Region" },
        { id: "country", label: "Country" },
        { id: "OEEE", label: "OEEE" },
        { id: "lastUpdate", label: "Last Update" }
    ];  

    function handleHeaderClick(header) {  
        setSort({ key: header.id, direction: 
            header.id === sort.key ? sort.direction === "asc" ? "desc" : "asc" : "desc"});
        console.log(`HEADER CLICKED ${header.id}, ${sort.key}, ${sort.direction}`)
    }

    function getSortedArray(arrayToSort) {
        if (sort.direction === "asc")
            return arrayToSort.sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : -1));
        return arrayToSort.sort((a, b) => (a[sort.key] > b[sort.key] ? -1 : 1));
    }


    return (
        <div className="flex flex-col items-center justify-center mx-auto z-30">
            <table className="table-auto w-10/12 text-center mb-4 rounded-3xl">
                <thead className="text-[#858A8F] font-medium text-sm border-b-2 border-[#858A8F] border-opacity-[70%]">
                    <tr className="rounded-3xl">
                        {tableHeaders.map((header) => (
                                <th key={header.id} onClick={() => handleHeaderClick(header)} scope="col" className="cursor-pointer px-4 py-2.5">{header.label}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {facilities.length > 0 
                        ? (
                            <>
                                {getSortedArray(facilities).slice(0, 3).map((facility) => (
                                    <tr className="flex-grow text-sm text-[#858A8F] h-2">
                                        {['name', 'address', 'lat', 'lon', 'city', 'state', 'country', 'OEEE', 'lastUpdate'].map((property) => (
                                            <td className="border px-4 py-2.5">{facility[property]}</td>
                                        ))}
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
                <Link href={"/"} className="group right-20 right-0 self-end align-middle justify-self-end text-right text-MainBlue hover:text-DarkBlue font-semibold md:text-lg text-sm pt-2 flex-none">
                    View all
                    <span className="pl-0.5 text-xl pt-2 group-hover:pl-1.5 duration-500">›</span>
                </Link>
            </table>
        </div>
    );
};

export default FactoryTable;
