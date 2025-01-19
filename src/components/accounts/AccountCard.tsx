import { AccountData } from "@/lib/appwrite";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AccountCardProps {
  account: AccountData;
}

export function AccountCard({ account }: AccountCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{account.name}</CardTitle>
        <CardDescription>
          {account.type === "bank"
            ? account.bankName
            : account.type === "mobile_money"
            ? account.mobileProvider
            : "Cash Account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            ${account.balance.toFixed(2)}
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