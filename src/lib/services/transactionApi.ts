import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TransactionData, DATABASES, databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { account } from '../appwrite';

export interface Transaction extends TransactionData {
    $id: string;
    $createdAt: string;
    category?: {
        name: string;
        $id: string;
    };
    account?: {
        name: string;
        $id: string;
    };
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
                    return { data: response.documents as unknown as Transaction[] };
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