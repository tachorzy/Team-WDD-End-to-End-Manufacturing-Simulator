import { useState } from "react";
export const useSortableTable = (data) => {
    const [tableData, setTableData] = useState(data);

    const handleSorting = (sortField: String, sortOrder: String) => {
        if (sortField) {
            const sorted = [...tableData].sort((a, b) => {
            if (a[sortField] === undefined) return 1;
            if (b[sortField] === undefined) return -1;
            if (a[sortField] === undefined && b[sortField] === undefined) return 0;
            return (
                a[sortField].toString().localeCompare(b[sortField].toString(), "en", {
                numeric: true,
                }) * (sortOrder === "asc" ? 1 : -1)
            );
            });
            setTableData(sorted);
        }
    };

    return [tableData, handleSorting];
};