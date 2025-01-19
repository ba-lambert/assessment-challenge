import { AccountData } from "@/lib/appwrite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Building2, Phone, Wallet, MoreVertical, Trash } from "lucide-react";

interface AccountCardProps {
  account: AccountData;
  onDelete: (id: string) => void;
}

export function AccountCard({ account, onDelete }: AccountCardProps) {
  const getAccountIcon = (type: AccountData['type']) => {
    switch (type) {
      case 'bank':
        return <Building2 className="h-5 w-5 text-blue-500" />;
      case 'mobile_money':
        return <Phone className="h-5 w-5 text-green-500" />;
      default:
        return <Wallet className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getAccountColor = (type: AccountData['type']) => {
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
    <Card className={`${getAccountColor(account.type)} shadow-md hover:shadow-lg transition-shadow`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          {getAccountIcon(account.type)}
          <div>
            <CardTitle>{account.name}</CardTitle>
            <CardDescription>
              {account.type === "bank"
                ? account.bankName
                : account.type === "mobile_money"
                ? account.mobileProvider
                : "Cash Account"}
            </CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="bg-red-500 text-white"
              onClick={() => onDelete(account.$id)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            RWF {account.balance.toFixed(2)}
          </div>
          {account.description && (
            <p className="text-sm text-muted-foreground">
              {account.description}
            </p>
          )}
          {(account.accountNumber || account.type === "mobile_money") && (
            <p className="text-sm">
              {account.type === "mobile_money"
                ? `Phone: ${account.accountNumber}`
                : `Acc: ${account.accountNumber}`}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 