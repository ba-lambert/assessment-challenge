import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Budget } from "@/lib/services/budgetApi";
import { useGetCategoriesQuery } from "@/lib/services/categoryApi";
import { AlertTriangle, RotateCcw, Trash, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";
import { AddBudgetDialog } from "./AddBudgetDialog";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { useUpdateBudgetSpentMutation, useDeleteBudgetMutation } from "@/lib/services/budgetApi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BudgetProgressProps {
    budgets?: Budget[];
}

export const BudgetProgress = ({ budgets }: BudgetProgressProps) => {
    const { data: categories } = useGetCategoriesQuery();
    const { toast } = useToast();
    const { user } = useUser();
    const [updateBudget] = useUpdateBudgetSpentMutation();
    const [deleteBudget] = useDeleteBudgetMutation();
    const notifiedBudgets = useRef<Set<string>>(new Set());

    const getProgressColor = (percentage: number) => {
        if (percentage >= 100) return "bg-destructive";
        if (percentage >= 90) return "bg-yellow-500";
        return "bg-green-500";
    };

    const handleReset = async (budgetId: string) => {
        try {
            await updateBudget({ id: budgetId, spent: 0  }).unwrap();
            toast({
                title: "Success",
                description: "Budget progress has been reset",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to reset budget",
            });
        }
    };

    const handleDelete = async (budgetId: string) => {
        try {
            await deleteBudget(budgetId).unwrap();
            toast({
                title: "Success",
                description: "Budget has been deleted",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete budget",
            });
        }
    };

    useEffect(() => {
        if (!user) return;

        budgets?.forEach(budget => {
            const category = categories?.find(c => c.$id === budget.categoryId);
            const percentage = (budget.spent / budget.amount) * 100;
            const budgetKey = `${budget.$id}-${percentage >= 100 ? 'exceeded' : 'warning'}`;
            
            if (!notifiedBudgets.current.has(budgetKey)) {
                if (percentage >= 90 && percentage < 100) {
                    toast({
                        title: `Hi ${user.name}, Budget Warning`,
                        description: `You've used ${percentage.toFixed(0)}% of your ${category?.name} budget`,
                        variant: "destructive",
                    });
                    notifiedBudgets.current.add(budgetKey);
                } else if (percentage >= 100) {
                    toast({
                        title: `Hi ${user.name}, Budget Exceeded`,
                        description: `You've exceeded your ${category?.name} budget`,
                        variant: "destructive",
                    });
                    notifiedBudgets.current.add(budgetKey);
                }
            }
        });
    }, [budgets, categories, toast, user]);

    if (!budgets?.length) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-medium">Budget Overview</CardTitle>
                    <AddBudgetDialog />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No budgets set. Create one to start tracking your spending.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium">Budget Overview</CardTitle>
                <AddBudgetDialog />
            </CardHeader>
            <CardContent className="space-y-4">
                {budgets.map(budget => {
                    const category = categories?.find(c => c.$id === budget.categoryId);
                    const percentage = (budget.spent / budget.amount) * 100;
                    const isWarning = percentage >= 90;

                    return (
                        <div key={budget.$id} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    {category?.name}
                                </span>
                                <div className="flex items-center gap-2">
                                    {isWarning && (
                                        <AlertTriangle className="h-4 w-4 text-destructive" />
                                    )}
                                    <span className="text-sm text-muted-foreground">
                                        RWF {budget.spent.toFixed(2)} / RWF {budget.amount.toFixed(2)}
                                    </span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => handleReset(budget.$id)}
                                            >
                                                <RotateCcw className="h-4 w-4 mr-2" />
                                                Reset Progress
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(budget.$id)}
                                                className="text-destructive"
                                            >
                                                <Trash className="h-4 w-4 mr-2" />
                                                Delete Budget
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            <Progress 
                                value={percentage} 
                                className={getProgressColor(percentage)}
                            />
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}; 