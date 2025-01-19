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
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCreateBudgetMutation } from "@/lib/services/budgetApi";
import { useGetCategoriesQuery } from "@/lib/services/categoryApi";

export const AddBudgetDialog = () => {
    const [open, setOpen] = useState(false);
    const [categoryId, setCategoryId] = useState('');
    const [amount, setAmount] = useState('');
    const [period, setPeriod] = useState<'monthly' | 'weekly'>('monthly');

    const { data: categories } = useGetCategoriesQuery();
    const [createBudget, { isLoading }] = useCreateBudgetMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createBudget({
                categoryId,
                amount: parseFloat(amount),
                period,
            }).unwrap();

            setOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error creating budget:", error);
        }
    };

    const resetForm = () => {
        setCategoryId('');
        setAmount('');
        setPeriod('monthly');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Budget
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Budget</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={categoryId} onValueChange={setCategoryId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
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
                        <Label>Period</Label>
                        <Select value={period} onValueChange={()=>setPeriod}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            step="0.01"
                            min="0"
                            placeholder="Enter budget amount"
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
                            'Create Budget'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}; 