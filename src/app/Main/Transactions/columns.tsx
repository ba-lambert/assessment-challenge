import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/lib/services/transactionApi";
import { Badge } from "@/components/ui/badge";

const TransactionTypeBadge = ({ type }: { type: Transaction['type'] }) => {
    const variants = {
        income: "bg-green-100 text-green-800",
        expense: "bg-red-100 text-red-800",
        transfer: "bg-blue-100 text-blue-800",
    };

    return (
        <Badge className={variants[type]}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
    );
};

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => <TransactionTypeBadge type={row.original.type} />,
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
            <span className={row.original.type === 'expense' ? 'text-red-600' : 'text-green-600'}>
                ${row.original.amount.toFixed(2)}
            </span>
        ),
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => row.original.category?.name,
    },
    {
        accessorKey: "account",
        header: "Account",
        cell: ({ row }) => row.original.account?.name,
    },
    {
        accessorKey: "description",
        header: "Description",
    },
]; 