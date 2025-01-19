import { BreadcrumbComponent } from "@/components/BreadCrumb";
import { AddCategoryDialog } from "./Categories/AddCategoryDialog";
import { CategoriesTable } from "./Categories/CategoriesTable";

const Categories = () => {
    return (
        <div className="mx-auto max-w-[1224px] flex flex-col gap-6 px-4">
            <div className="flex flex-row justify-between items-center w-full">
                <BreadcrumbComponent
                    items={[
                        { title: 'Home', href: '/' },
                        { title: 'Categories', href: '/categories' }
                    ]} 
                />
                <AddCategoryDialog />
            </div>
            <CategoriesTable />
        </div>
    );
};

export default Categories;