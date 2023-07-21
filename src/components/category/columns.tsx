"use client"

import { ColumnDef } from "@tanstack/react-table"
import {CategoryColumn} from "@/types/category-column";
import CellAction from "@/components/category/cell-action";


export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({row}) => row.original.billboardLabel,
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
