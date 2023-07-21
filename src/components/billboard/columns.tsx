"use client"

import { ColumnDef } from "@tanstack/react-table"
import {BillboardColumn} from "@/types/billboard-column";
import CellAction from "@/components/billboard/cell-action";


export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
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
