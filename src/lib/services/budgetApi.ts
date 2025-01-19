import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { DATABASES, databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { account } from '../appwrite';

export interface Budget {
    $id: string;
    $createdAt: string;
    userId: string;
    categoryId: string;
    amount: number;
    period: 'monthly' | 'weekly';
    spent: number;
}

export const budgetApi = createApi({
    reducerPath: 'budgetApi',
    tagTypes: ['Budgets'],
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    endpoints: (builder) => ({
        getBudgets: builder.query<Budget[], void>({
            async queryFn() {
                try {
                    const currentUser = await account.get();
                    const response = await databases.listDocuments(
                        DATABASES.ID,
                        DATABASES.BUDGETS_COLLECTION,
                        [Query.equal('userId', currentUser.$id)]
                    );
                    return { data: response.documents as unknown as Budget[] };
                } catch (error) {
                    return { error: { status: 500, data: error } };
                }
            },
            providesTags: ['Budgets'],
        }),
        createBudget: builder.mutation<Budget, Omit<Budget, '$id' | '$createdAt' | 'userId' | 'spent'>>({
            async queryFn(data) {
                try {
                    const currentUser = await account.get();
                    const response = await databases.createDocument(
                        DATABASES.ID,
                        DATABASES.BUDGETS_COLLECTION,
                        ID.unique(),
                        {
                            ...data,
                            userId: currentUser.$id,
                            spent: 0,
                        }
                    );
                    return { data: response as unknown as Budget };
                } catch (error) {
                    return { error: { status: 500, data: error } };
                }
            },
            invalidatesTags: ['Budgets'],
        }),
        updateBudgetSpent: builder.mutation<Budget, { id: string; spent: number }>({
            async queryFn({ id, spent }) {
                try {
                    const response = await databases.updateDocument(
                        DATABASES.ID,
                        DATABASES.BUDGETS_COLLECTION,
                        id,
                        { spent }
                    );
                    return { data: response as unknown as Budget };
                } catch (error) {
                    return { error: { status: 500, data: error } };
                }
            },
            invalidatesTags: ['Budgets'],
        }),
    }),
});

export const {
    useGetBudgetsQuery,
    useCreateBudgetMutation,
    useUpdateBudgetSpentMutation,
} = budgetApi; 