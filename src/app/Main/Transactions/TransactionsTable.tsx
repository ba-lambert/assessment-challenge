import { useGetTransactionsQuery } from "@/lib/services/transactionApi";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export const TransactionsTable = () => {
    const { data: transactions, isLoading } = useGetTransactionsQuery();

    if (isLoading) {
        return <TableSkeleton columns={6} rows={5} />;
    }

    return (
        <DataTable 
            columns={columns} 
            data={transactions ?? []} 
            searchKey="description"
        />
    );
}; 