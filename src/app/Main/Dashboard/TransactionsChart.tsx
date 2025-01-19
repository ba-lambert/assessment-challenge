import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/lib/services/transactionApi";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { format, startOfWeek, startOfMonth, eachDayOfInterval, subMonths, subWeeks } from "date-fns";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Period = 'weekly' | 'monthly';

interface TransactionsChartProps {
    transactions?: Transaction[];
}

export const TransactionsChart = ({ transactions }: TransactionsChartProps) => {
    const [period, setPeriod] = useState<Period>('monthly');

    const getDaysInRange = () => {
        const today = new Date();
        if (period === 'weekly') {
            const startDate = startOfWeek(subWeeks(today, 1));
            return eachDayOfInterval({ start: startDate, end: today });
        } else {
            const startDate = startOfMonth(subMonths(today, 1));
            return eachDayOfInterval({ start: startDate, end: today });
        }
    };

    const days = getDaysInRange();

    const dailyTotals = days.map(date => {
        const dayStr = format(date, 'yyyy-MM-dd');
        const dayTransactions = transactions?.filter(t => t.date.startsWith(dayStr)) ?? [];
        const income = dayTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const expense = dayTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        return { date, income, expense };
    });

    const totalIncome = dailyTotals.reduce((sum, day) => sum + day.income, 0);
    const totalExpenses = dailyTotals.reduce((sum, day) => sum + day.expense, 0);
    const netAmount = totalIncome - totalExpenses;

    const data = {
        labels: dailyTotals.map(({ date }) => format(date, 'MMM dd')),
        datasets: [
            {
                label: 'Income',
                data: dailyTotals.map(d => d.income),
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1,
            },
            {
                label: 'Expenses',
                data: dailyTotals.map(d => d.expense),
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                stacked: false,
                grid: {
                    display: false,
                },
            },
            y: {
                stacked: false,
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    return (
        <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-base font-medium">
                        Transaction Overview
                    </CardTitle>
                    <div className="mt-1 space-x-4 text-sm text-muted-foreground">
                        <span>Income: ${totalIncome.toFixed(2)}</span>
                        <span>Expenses: ${totalExpenses.toFixed(2)}</span>
                        <span className={netAmount >= 0 ? "text-green-600" : "text-red-600"}>
                            Net: ${netAmount.toFixed(2)}
                        </span>
                    </div>
                </div>
                <Select value={period} onValueChange={(value: Period) => setPeriod(value)}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <Bar data={data} options={options} />
                </div>
            </CardContent>
        </Card>
    );
}; 