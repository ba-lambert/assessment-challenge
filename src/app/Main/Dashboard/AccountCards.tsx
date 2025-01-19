import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Account } from "@/lib/services/accountApi";

interface AccountCardsProps {
    accounts?: Account[];
}

export const AccountCards = ({ accounts }: AccountCardsProps) => {
    return (
        <>
            {accounts?.map(account => (
                <Card key={account.$id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {account.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${account.balance.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {account.type}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}; 