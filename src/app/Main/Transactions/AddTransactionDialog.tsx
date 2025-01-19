import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCreateTransactionMutation } from "@/lib/services/transactionApi";
import { useGetCategoriesQuery } from "@/lib/services/categoryApi";
import { useGetAccountsQuery, useUpdateAccountMutation } from "@/lib/services/accountApi";
import { TransactionType } from "@/lib/appwrite";
import { useGetBudgetsQuery, useUpdateBudgetSpentMutation } from "@/lib/services/budgetApi";

export const AddTransactionDialog = () => {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<TransactionType>('expense');
    const [categoryId, setCategoryId] = useState('');
    const [accountId, setAccountId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [destinationAccountId, setDestinationAccountId] = useState('');

    const { data: categories } = useGetCategoriesQuery();
    const { data: accounts } = useGetAccountsQuery();
    const [createTransaction, { isLoading }] = useCreateTransactionMutation();
    const [updateAccount] = useUpdateAccountMutation();
    const { data: budgets } = useGetBudgetsQuery();
    const [updateBudgetSpent] = useUpdateBudgetSpentMutation();

    const hasCategories = categories && categories.length > 0;
    const hasAccounts = accounts && accounts.length > 0;

    const getButtonTooltip = () => {
        if (!hasCategories && !hasAccounts) return "Please add categories and accounts first";
        if (!hasCategories) return "Please add at least one category first";
        if (!hasAccounts) return "Please add at least one account first";
        return "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const selectedAccount = accounts?.find(acc => acc.$id === accountId);
            if (!selectedAccount) return;

            let newBalance = selectedAccount.balance;
            const transactionAmount = parseFloat(amount);

            if (type === 'expense') {
                newBalance -= transactionAmount;
            } else if (type === 'income') {
                newBalance += transactionAmount;
            } else if (type === 'transfer') {
                await updateAccount({
                    id: accountId,
                    data: { balance: newBalance - transactionAmount }
                }).unwrap();
                
                await updateAccount({
                    id: destinationAccountId,
                    data: { balance: (accounts?.find(acc => acc.$id === destinationAccountId)?.balance || 0) + transactionAmount }
                }).unwrap();
                
                await createTransaction({
                    type,
                    categoryId,
                    accountId,
                    toAccountId: destinationAccountId,
                    amount: transactionAmount,
                    description,
                    date,
                }).unwrap();
                
                setOpen(false);
                resetForm();
                return;
            }

            // Update account balance
            await updateAccount({
                id: accountId,
                data: { balance: newBalance }
            }).unwrap();

            // Update budget spent amount if it's an expense
            if (type === 'expense') {
                const budget = budgets?.find(b => b.categoryId === categoryId);
                if (budget) {
                    const newSpent = budget.spent + parseFloat(amount);
                    await updateBudgetSpent({
                        id: budget.$id,
                        spent: newSpent,
                    }).unwrap();
                }
            }

            // Create transaction
            await createTransaction({
                type,
                categoryId,
                accountId,
                amount: transactionAmount,
                description,
                date,
            }).unwrap();

            setOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error creating transaction:", error);
        }
    };

    const resetForm = () => {
        setType('expense');
        setCategoryId('');
        setAccountId('');
        setAmount('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        setDestinationAccountId('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="relative inline-block">
                    <Button 
                        className="text-xs"
                        disabled={!hasCategories || !hasAccounts}
                        title={getButtonTooltip()}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Transaction
                    </Button>
                    {(!hasCategories || !hasAccounts) && (
                        <div className="absolute top-full mt-2 w-48 p-2 text-xs bg-secondary text-secondary-foreground rounded-md shadow-lg">
                            {!hasCategories && (
                                <p className="mb-1">⚠️ No categories available</p>
                            )}
                            {!hasAccounts && (
                                <p>⚠️ No accounts available</p>
                            )}
                        </div>
                    )}
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                    {(!hasCategories || !hasAccounts) && (
                        <div className="mt-2 text-sm text-destructive">
                            {!hasCategories && (
                                <p>Please add categories before creating transactions.</p>
                            )}
                            {!hasAccounts && (
                                <p>Please add accounts before creating transactions.</p>
                            )}
                        </div>
                    )}
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                            value={type}
                            onValueChange={(value: TransactionType) => {
                                setType(value);
                                if (value !== 'transfer') {
                                    setDestinationAccountId('');
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="expense">Expense</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="transfer">Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={categoryId} onValueChange={setCategoryId}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {categories?.map((category) => (
                                    <SelectItem key={category.$id} value={category.$id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>{type === 'transfer' ? 'From Account' : 'Account'}</Label>
                        <Select value={accountId} onValueChange={setAccountId}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {accounts?.map((account) => (
                                    <SelectItem key={account.$id} value={account.$id}>
                                        {account.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {type === 'transfer' && (
                        <div className="space-y-2">
                            <Label>To Account</Label>
                            <Select 
                                value={destinationAccountId} 
                                onValueChange={setDestinationAccountId}
                                required={type === 'transfer'}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {accounts?.filter(acc => acc.$id !== accountId).map((account) => (
                                        <SelectItem key={account.$id} value={account.$id}>
                                            {account.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            step="0.01"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Transaction'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}; 