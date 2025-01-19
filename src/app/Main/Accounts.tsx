import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Plus } from "lucide-react";
import { accountService, AccountData, AccountType } from "@/lib/appwrite";
import { BreadcrumbComponent } from "@/components/BreadCrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const accountSchema = yup.object({
  name: yup.string().required("Account name is required"),
  type: yup.string().oneOf(['mobile_money', 'cash', 'bank'] as const).required("Account type is required"),
  balance: yup.number().required("Initial balance is required").min(0, "Balance cannot be negative"),
  description: yup.string().optional(),
  bankName: yup.string().when('type', {
    is: 'bank',
    then: (schema) => schema.required("Bank name is required"),
  }),
  mobileProvider: yup.string().when('type', {
    is: 'mobile_money',
    then: (schema) => schema.required("Mobile provider is required"),
  }),
}).required();

type AccountFormData = yup.InferType<typeof accountSchema>;

export default function Accounts() {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<AccountFormData>({
    resolver: yupResolver(accountSchema),
    defaultValues: {
      name: "",
      type: undefined,
      balance: 0,
      description: "",
    },
  });

  const { watch } = form;
  const accountType = watch("type") as AccountType;

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const response = await accountService.getUserAccounts();
      setAccounts(response.documents as unknown as AccountData[]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load accounts",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: AccountFormData) => {
    try {
      await accountService.createAccount(data);
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      setOpen(false);
      loadAccounts();
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create account",
      });
    }
  };

  return (
    <div className="mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <BreadcrumbComponent
          items={[{ title: "Accounts", href: "/accounts" }]}
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="text-xs">
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
              <DialogDescription>
                Add a new account to track your finances
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Savings" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank">Bank Account</SelectItem>
                          <SelectItem value="mobile_money">Mobile Money</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Balance</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {accountType === "bank" && (
                  <>
                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Bank Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {accountType === "mobile_money" && (
                  <>
                    <FormField
                      control={form.control}
                      name="mobileProvider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Provider</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select provider" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="mpesa">M-Pesa</SelectItem>
                              <SelectItem value="airtel">Airtel Money</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add some notes about this account"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  {form.formState.isSubmitting ? "Creating..." : "Create Account"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No accounts found. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account,key) => (
            <Card key={key}>
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
          ))}
        </div>
      )}
    </div>
  );
}