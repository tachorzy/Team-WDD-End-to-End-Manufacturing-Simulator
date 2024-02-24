import React from "react";

const FactoryTable = () => (
    <div className="flex flex-col items-center justify-center mx-auto z-30">
        <table className="table-auto w-10/12 text-center mb-4 rounded-3xl">
            <thead className="text-[#858A8F] font-medium text-sm border-b-2 border-[#858A8F] border-opacity-[70%]">
                <tr className="rounded-3xl">
                    <th scope="col" className="px-4 py-2.5"> Facility Name</th>
                    <th scope="col" className="px-4 py-2.5"> Address</th>
                    <th scope="col" className="px-4 py-2.5"> Latitude</th>
                    <th scope="col" className="px-4 py-2.5"> Longitude</th>
                    <th scope="col" className="px-4 py-2.5"> City </th>
                    <th scope="col" className="px-4 py-2.5"> State </th>
                    <th scope="col" className="px-4 py-2.5"> Country</th>
                    <th scope="col" className="px-4 py-2.5"> OEEE</th>
                    <th scope="col" className="px-4 py-2.5"> Lastest Update</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
);

export default FactoryTable;
