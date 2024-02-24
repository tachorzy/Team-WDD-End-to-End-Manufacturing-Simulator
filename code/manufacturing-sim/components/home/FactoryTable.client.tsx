import React from "react";

const FactoryTable = (props: { }) => {
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

            </tbody>
        </table>
    </div>
)};

export default FactoryTable;
