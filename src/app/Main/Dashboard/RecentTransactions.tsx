import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/lib/services/transactionApi";
import { Badge } from "@/components/ui/badge";

interface RecentTransactionsProps {
    transactions?: Transaction[];
}

export const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
    const recentTransactions = transactions?.slice(0, 5) ?? [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentTransactions.map(transaction => (
                        <div key={transaction.$id} className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium">
                                    {transaction.description || 'No description'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(transaction.date).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={transaction.type === 'expense' ? 'destructive' : 'default'}>
                                    ${transaction.amount.toFixed(2)}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}; 