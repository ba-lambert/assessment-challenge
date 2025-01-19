import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TransactionData, DATABASES, databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { account } from '../appwrite';

export interface Transaction extends TransactionData {
    $id: string;
    $createdAt: string;
    category?: {
        name: string;
        [key: string]: any;
    };
    account?: {
        name: string;
        [key: string]: any;
    };
    toAccount?: {
        name: string;
        [key: string]: any;
    } | null;
}

export const transactionApi = createApi({
    reducerPath: 'transactionApi',
    tagTypes: ['Transactions'],
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    endpoints: (builder) => ({
        getTransactions: builder.query<Transaction[], void>({
            async queryFn() {
                try {
                    const currentUser = await account.get();
                    const response = await databases.listDocuments(
                        DATABASES.ID,
                        DATABASES.TRANSACTIONS_COLLECTION,
                        [
                            Query.equal('userId', currentUser.$id),
                            Query.orderDesc('date')
                        ]
                    );
                    const categoryIds = [...new Set(response.documents.map(doc => doc.categoryId))];
                    const accountIds = [...new Set(response.documents.map(doc => doc.accountId))];
                    const toAccountIds = [...new Set(response.documents.map(doc => doc.toAccountId).filter(Boolean))];

                    // Fetch categories and accounts in parallel
                    const [categories, accounts] = await Promise.all([
                        databases.listDocuments(
                            DATABASES.ID,
                            DATABASES.CATEGORIES_COLLECTION,
                            [Query.equal('$id', categoryIds)]
                        ),
                        databases.listDocuments(
                            DATABASES.ID,
                            DATABASES.ACCOUNTS_COLLECTION,
                            [Query.equal('$id', [...accountIds, ...toAccountIds])]
                        ),
                    ]);

                    const categoryMap = new Map(categories.documents.map(cat => [cat.$id, cat]));
                    const accountMap = new Map(accounts.documents.map(acc => [acc.$id, acc]));

                    const populatedTransactions = response.documents.map(transaction => ({
                        ...transaction,
                        category: categoryMap.get(transaction.categoryId),
                        account: accountMap.get(transaction.accountId),
                        toAccount: transaction.toAccountId ? accountMap.get(transaction.toAccountId) : null
                    }));

                    return { data: populatedTransactions as unknown as Transaction[] };
                } catch (error) {
                    return { error: { status: 500, data: error } };
                }
            },
            providesTags: ['Transactions'],
        }),
        createTransaction: builder.mutation<Transaction, Omit<TransactionData, 'userId'>>({
            async queryFn(data) {
                try {
                    const currentUser = await account.get();
                    const response = await databases.createDocument(
                        DATABASES.ID,
                        DATABASES.TRANSACTIONS_COLLECTION,
                        ID.unique(),
                        {
                            ...data,
                            userId: currentUser.$id,
                        }
                    );
                    return { data: response as unknown as Transaction };
                } catch (error) {
                    return { error: { status: 500, data: error } };
                }
            },
            invalidatesTags: ['Transactions'],
        }),
    }),
});

export const {
    useGetTransactionsQuery,
    useCreateTransactionMutation,
} = transactionApi; 