import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Account } from "@/lib/services/accountApi";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AccountsChartProps {
    accounts?: Account[];
}

export const AccountsChart = ({ accounts }: AccountsChartProps) => {
    const data = {
        labels: accounts?.map(account => account.name) ?? [],
        datasets: [
            {
                data: accounts?.map(account => account.balance) ?? [],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Account Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <Doughnut data={data} options={{ responsive: true }} />
            </CardContent>
        </Card>
    );
}; 