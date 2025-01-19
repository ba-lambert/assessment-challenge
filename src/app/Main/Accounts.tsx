import { useState } from "react";
import { BreadcrumbComponent } from "@/components/BreadCrumb";
import { AccountCard } from "@/components/AccountCard";
import { AddAccountDialog } from "@/components/AddAccountDialog";
import { useGetAccountsQuery, useDeleteAccountMutation } from "@/lib/services/accountApi";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Accounts() {
  const { data: accounts, isLoading, refetch } = useGetAccountsQuery();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteAccount, { isLoading: deletingLoading }] = useDeleteAccountMutation();

  const handleDeleteAccount = async () => {
    try {
      if (!selectedAccount) return;
      await deleteAccount(selectedAccount).unwrap();
      toast({
        title: "Success",
        description: "Account deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete account",
      });
    }
  };

  return (
    <div className="mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <BreadcrumbComponent items={[{ title: "Accounts", href: "/accounts" }]} />
        <AddAccountDialog onSuccess={refetch} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : accounts?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No accounts found. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accounts && accounts?.map((account) => (
            <AccountCard 
              key={account.$id} 
              account={account} 
              onDelete={(id) => {
                setSelectedAccount(id);
                setIsDeleteDialogOpen(true);
              }} 
            />
          ))}
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the account
              and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground"
            >
              {deletingLoading ? '...deleting' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}