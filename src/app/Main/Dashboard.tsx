import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAccountsQuery } from "@/lib/services/accountApi";
import { useGetTransactionsQuery } from "@/lib/services/transactionApi";
import { AccountsChart } from "./Dashboard/AccountsChart";
import { TransactionsChart } from "./Dashboard/TransactionsChart";
import { RecentTransactions } from "./Dashboard/RecentTransactions";
import { AccountCards } from "./Dashboard/AccountCards";
import { BudgetProgress } from "./Dashboard/BudgetProgress";
import { useGetBudgetsQuery } from "@/lib/services/budgetApi";
import { AddBudgetDialog } from "./Dashboard/AddBudgetDialog";

const Dashboard = () => {
    const { data: accounts } = useGetAccountsQuery();
    const { data: transactions } = useGetTransactionsQuery();
    const { data: budgets } = useGetBudgetsQuery();

    const totalBalance = accounts?.reduce((sum, acc) => sum + acc.balance, 0) ?? 0;

    return (
        <div className="container mx-auto py-6 space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <AccountCards accounts={accounts} />
                <AddBudgetDialog />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <TransactionsChart transactions={transactions} />
                <AccountsChart accounts={accounts} />
                <BudgetProgress budgets={budgets} />
            </div>

            <RecentTransactions transactions={transactions} />
        </div>
    );
};

export default Dashboard;