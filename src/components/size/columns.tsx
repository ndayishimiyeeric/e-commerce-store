"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "@/components/size/cell-action";
import {SizeColumn} from "@/types/size-column";


export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
    {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original}/>
  },
]
