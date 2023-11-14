"use client"

import { ColumnDef } from "@tanstack/react-table"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type orderColumn = {
  id: string
  name: string
  phone: string
  address: string
  isPaid: boolean
  totalPrice: string
  products: string
  createdAt: string
}

export const columns: ColumnDef<orderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },

  {
    accessorKey: "name",
    header: "Name",
  },

  {
    accessorKey: "phone",
    header: "Phone",
  },

  {
    accessorKey: "address",
    header: "Address",
  },

  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },

  {
    accessorKey: "isPaid",
    header: "Paid",
  },
]
