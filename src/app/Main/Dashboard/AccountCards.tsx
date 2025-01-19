import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Account } from "@/lib/services/accountApi";
import { Building2, Phone, Wallet } from "lucide-react";

interface AccountCardsProps {
    accounts?: Account[];
}

export const AccountCards = ({ accounts }: AccountCardsProps) => {
    const getAccountIcon = (type: Account['type']) => {
        switch (type) {
            case 'bank':
                return <Building2 className="h-5 w-5 text-blue-500" />;
            case 'mobile_money':
                return <Phone className="h-5 w-5 text-green-500" />;
            default:
                return <Wallet className="h-5 w-5 text-yellow-500" />;
        }
    };

    const getAccountColor = (type: Account['type']) => {
        switch (type) {
            case 'bank':
                return 'border-l-4 border-blue-500';
            case 'mobile_money':
                return 'border-l-4 border-green-500';
            default:
                return 'border-l-4 border-yellow-500';
        }
    };

    return (
        <>
            {accounts?.map(account => (
                <Card 
                    key={account.$id} 
                    className={`${getAccountColor(account.type)} shadow-md hover:shadow-lg transition-shadow`}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-2">
                            {getAccountIcon(account.type)}
                            <CardTitle className="text-sm font-medium">
                                {account.name}
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            RWF {account.balance.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {account.type === "bank"
                                ? account.bankName
                                : account.type === "mobile_money"
                                    ? account.mobileProvider
                                    : "Cash Account"}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}; 