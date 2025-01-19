import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Category, useDeleteCategoryMutation } from "@/lib/services/categoryApi";
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
import { useState } from "react";
import { EditCategoryDialog } from "./EditCategoryDialog";

interface CategoryActionsProps {
    category: Category;
}

export const CategoryActions = ({ category }: CategoryActionsProps) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

    const handleDelete = async () => {
        try {
            await deleteCategory(category.$id).unwrap();
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    return (
        <div className="flex gap-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEditDialog(true)}
            >
                <Edit className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
            >
                <Trash2 className="h-4 w-4" />
            </Button>

            <EditCategoryDialog
                category={category}
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
            />

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            category "{category.name}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}; 