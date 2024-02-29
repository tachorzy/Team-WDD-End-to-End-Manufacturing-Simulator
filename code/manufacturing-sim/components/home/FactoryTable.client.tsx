import React, { useState, useEffect } from "react";
import Link from "next/link";
import Caret from "./table/Caret";
import { getAllFactories } from "@/app/api/factories/factoryAPI";

const FactoryTable = () => {
    const [facilities, setFacilities] = useState([]);
    const [sort, setSort] = useState({ key: "name", direction: "" });

    useEffect(() => {
        const fetchFactories = async () => {
            try {
                const response = await getAllFactories();
                console.log("Full API Response:", response);
                const parsedData = JSON.parse(response.body);
                setFacilities(parsedData);
                console.log(parsedData);
            } catch (error) {
                console.error("Error fetching factories:", error);
            }
        };

        fetchFactories();
    }, []);

    const tableHeaders = [
        { id: "name", label: "Facility Name" },
        { id: "lat", label: "Latitude" },
        { id: "lon", label: "Longitude" },
        { id: "description", label: "Description" },
    ];

    function handleHeaderClick(header) {
        setSort({
            key: header.id,
            direction:
                header.id === sort.key
                    ? sort.direction === "asc"
                        ? "desc"
                        : "asc"
                    : "desc",
        });
    }

    function getSortedArray(arrayToSort) {
        return sort.direction === "asc"
            ? [...arrayToSort].sort((a, b) =>
                  a[sort.key] > b[sort.key] ? 1 : -1,
              )
            : [...arrayToSort].sort((a, b) =>
                  a[sort.key] < b[sort.key] ? 1 : -1,
              );
    }

    return (
        <div className="flex flex-col items-center justify-center mx-auto z-30">
            <table className="table-auto w-10/12 text-center mb-4 rounded-3xl">
                <thead className="text-[#858A8F] font-medium text-sm border-b-2 border-[#858A8F] border-opacity-[70%]">
                    <tr className="rounded-3xl">
                        {tableHeaders.map((header) => (
                            <th
                                key={header.id}
                                onClick={() => handleHeaderClick(header)}
                                scope="col"
                                className="cursor-pointer px-4 py-2.5"
                            >
                                <div className="flex flex-row gap-x-0 align-bottom">
                                    {header.label}
                                    {sort.direction !== "" && (
                                        <span>
                                            <Caret direction={sort.direction} />
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {facilities.length > 0 ? (
                        getSortedArray(facilities)
                            .slice(0, 6)
                            .map((facility) => (
                                <tr
                                    key={facility.factoryId}
                                    className="text-sm text-[#858A8F]"
                                >
                                    {tableHeaders.map((header) => {
                                        let cellValue;
                                        if (
                                            header.id === "lat" ||
                                            header.id === "lon"
                                        ) {
                                            cellValue =
                                                facility.location[
                                                    header.id === "lat"
                                                        ? "latitude"
                                                        : "longitude"
                                                ];
                                        } else {
                                            cellValue = facility[header.id];
                                        }
                                        return (
                                            <td
                                                key={header.id}
                                                className="border px-4 py-2.5"
                                            >
                                                {cellValue}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                    ) : (
                        <tr>
                            <td
                                className="border px-4 py-2 h-60 text-lg text-gray-400"
                                colSpan={tableHeaders.length}
                            >
                                <i>No Facilities Found</i>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Link href="/">View all</Link>
        </div>
    );
};

export default FactoryTable;
