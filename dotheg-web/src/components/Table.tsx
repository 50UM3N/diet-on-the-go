import { Group, Pagination, Table as MTable, Text, Button, ButtonProps, Paper, TextInput } from "@mantine/core";
import { fuzzyFilter } from "../utils";

import { ColumnDef, getCoreRowModel, getFacetedMinMaxValues, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, flexRender, useReactTable } from "@tanstack/react-table";
import { useDebouncedState } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";

type Props = {
  columns: ColumnDef<any, any>[];
  data: any;
  showAddButton?: boolean;
  buttonProps?: ButtonProps;
  onAddButtonClick?: () => void;
};

const Table = (props: Props) => {
  const [globalFilter, setGlobalFilter] = useDebouncedState("", 200);
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
      <Group justify="space-between">
        <TextInput styles={{ input: { borderWidth: 2 } }} leftSection={<IconSearch size={16} />} placeholder="Global Search " defaultValue={globalFilter} onChange={(e) => setGlobalFilter(e.currentTarget.value)} />
        {props.showAddButton && (
          <Button {...props.buttonProps} onClick={props.onAddButtonClick}>
            {props.buttonProps?.children || "Add New"}
          </Button>
        )}
      </Group>

      <Paper mt="md" mb="xs" radius="md" withBorder style={{ overflow: "auto" }}>
        <MTable className="global-table" striped highlightOnHover withColumnBorders>
          <MTable.Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <MTable.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <MTable.Th key={header.id} colSpan={header.colSpan} style={{ width: header.getSize() }}>
                      {header?.column?.columnDef?.header as "string"}
                    </MTable.Th>
                  );
                })}
              </MTable.Tr>
            ))}
          </MTable.Thead>
          <MTable.Tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <MTable.Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return <MTable.Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</MTable.Td>;
                  })}
                </MTable.Tr>
              );
            })}
          </MTable.Tbody>
        </MTable>
      </Paper>
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Showing <strong>{table.getState().pagination.pageIndex + 1}</strong> of <strong>{table.getPageCount()}</strong> results
        </Text>
        <Pagination total={table.getPageCount()} value={table.getState().pagination.pageIndex + 1} onChange={(page) => table.setPageIndex(page - 1)} size="sm" />
      </Group>
    </>
  );
};

export default Table;
