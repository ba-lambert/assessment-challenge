import { ColumnDef } from "@tanstack/react-table";
import { Category } from "@/lib/services/categoryApi";
// import { Button } from "@/components/ui/button";
// import { Edit, Trash2 } from "lucide-react";
import { CategoryActions } from "./CategoryActions";

export const columns: ColumnDef<Category>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            return new Date(row.original.$createdAt).toLocaleDateString();
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return <CategoryActions category={row.original} />;
        },
    },
]; 