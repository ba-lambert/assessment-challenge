import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AccountData, DATABASES, databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { account } from '../appwrite';

export interface Account extends AccountData {
    $id: string;
    $createdAt: string;
}

export const accountApi = createApi({
    reducerPath: 'accountApi',
    tagTypes: ['Accounts'],
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    endpoints: (builder) => ({
        getAccounts: builder.query<Account[], void>({
            async queryFn() {
                try {
                    const currentUser = await account.get();
                    const response = await databases.listDocuments(
                        DATABASES.ID,
                        DATABASES.ACCOUNTS_COLLECTION,
                        [Query.equal('userId', currentUser.$id)]
                    );
                    return { data: response.documents as unknown as Account[] };
                } catch (error) {
                    return { error: { status: 500, data: error } };
                }
            },
            providesTags: ['Accounts'],
        }),
        updateAccount: builder.mutation<Account, { id: string; data: Partial<AccountData> }>({
            async queryFn({ id, data }) {
                try {
                    const response = await databases.updateDocument(
                        DATABASES.ID,
                        DATABASES.ACCOUNTS_COLLECTION,
                        id,
                        data
                    );
                    return { data: response as unknown as Account };
                } catch (error) {
                    return { error: { status: 500, data: error } };
                }
            },
            invalidatesTags: ['Accounts'],
        }),
        updateAccountBalance: builder.mutation<Account, { id: string; amount: number; type: 'add' | 'subtract' }>({
            async queryFn({ id, amount, type }) {
                try {
                    const account = await databases.getDocument(
                        DATABASES.ID,
                        DATABASES.ACCOUNTS_COLLECTION,
                        id
                    );
                    const newBalance = type === 'add' 
                        ? account.balance + amount 
                        : account.balance - amount;

                    const response = await databases.updateDocument(
                        DATABASES.ID,
                        DATABASES.ACCOUNTS_COLLECTION,
                        id,
                        { balance: newBalance }
                    );
                    return { data: response as unknown as Account };
                } catch (error) {
                    return { error: { status: 500, data: error } };
                }
            },
            invalidatesTags: ['Accounts'],
        }),
        deleteAccount: builder.mutation<void, string>({
            async queryFn(id) {
                try {
                    await databases.deleteDocument(
                        DATABASES.ID,
                        DATABASES.ACCOUNTS_COLLECTION,
                        id
                    );
                    return { data: undefined };
                } catch (error) {
                    return { error: { status: 500, data: error } };
                }
            },
            invalidatesTags: ['Accounts'],
        }),
    }),
});

export const { 
  useGetAccountsQuery, 
  useUpdateAccountMutation,
  useUpdateAccountBalanceMutation,
  useDeleteAccountMutation 
} = accountApi; 