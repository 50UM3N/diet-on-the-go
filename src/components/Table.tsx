import React from "react";
import {
    createStyles,
    Group,
    Pagination,
    Table as MTable,
    Text,
} from "@mantine/core";
import { fuzzyFilter } from "../utils";
import GlobalFilter from "./GlobalFilter";

import {
    ColumnDef,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    useReactTable,
} from "@tanstack/react-table";

type Props = {
    columns: ColumnDef<any, any>[];
    data: any;
};
const useStyle = createStyles((theme) => ({
    table: {
        "td, th": {
            whiteSpace: "nowrap",
        },
    },
}));
const Table = (props: Props) => {
    const { classes } = useStyle();
    const [globalFilter, setGlobalFilter] = React.useState("");
    const table = useReactTable({
        data: props.data,
        columns: props.columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
    });
    return (
        <>
            <GlobalFilter setGlobalFilter={setGlobalFilter} />
            <MTable className={classes.table} fontSize="xs" mt="md" mb="xs">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {
                                            header?.column?.columnDef
                                                ?.header as "string"
                                        }
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </MTable>
            <Group position="apart">
                <Text>
                    Showing{" "}
                    <strong>{table.getState().pagination.pageIndex + 1}</strong>{" "}
                    of <strong>{table.getPageCount()}</strong> results
                </Text>
                <Pagination
                    total={table.getPageCount()}
                    page={table.getState().pagination.pageIndex + 1}
                    onChange={(page) => table.setPageIndex(page - 1)}
                    size="sm"
                />
            </Group>
        </>
    );
};

export default Table;
