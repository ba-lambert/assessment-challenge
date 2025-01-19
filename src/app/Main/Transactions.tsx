import { BreadcrumbComponent } from "@/components/BreadCrumb"
import { AddTransactionDialog } from "./Transactions/AddTransactionDialog"
import { TransactionsTable } from "./Transactions/TransactionsTable"

const Transactions = ()=>{
    return(
        <div className="mx-auto max-w-[1224px] flex flex-col gap-6 px-4">
            <div className="flex flex-row justify-between items-center w-full">
                <BreadcrumbComponent
                    items={[
                        { title: 'Home', href: '/' },
                        { title: 'Transactions', href: '/transactions' }
                    ]}
                />
                <AddTransactionDialog />
            </div>
            <TransactionsTable />
        </div>
    )
}

export default Transactions