import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Category, useUpdateCategoryMutation } from "@/lib/services/categoryApi";

interface EditCategoryDialogProps {
    category: Category;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditCategoryDialog = ({
    category,
    open,
    onOpenChange,
}: EditCategoryDialogProps) => {
    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description || "");
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateCategory({
                id: category.$id,
                data: { name, description },
            }).unwrap();
            onOpenChange(false);
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter category name"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter category description"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Update Category'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}; 