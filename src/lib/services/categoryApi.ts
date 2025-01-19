import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CategoryData, DATABASES, databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { account } from '../appwrite';

export interface Category extends CategoryData {
    $id: string;
    $createdAt: string;
    userId: string;
}

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    tagTypes: ['Categories'],
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], void>({
            async queryFn() {
                try {
                    const currentUser = await account.get();
                    const response = await databases.listDocuments(
                        DATABASES.ID,
                        DATABASES.CATEGORIES_COLLECTION,
                        [Query.equal('userId', currentUser.$id)]
                    );
                    return { data: response.documents as unknown as Category[] };
                } catch (error) {
                    return { error: { status: 500, data: error } };
                }
            },
            providesTags: ['Categories'],
        }),
        createCategory: builder.mutation<Category, CategoryData>({
            async queryFn(data) {
                try {
                    const currentUser = await account.get();
                    const response = await databases.createDocument(
                        DATABASES.ID,
                        DATABASES.CATEGORIES_COLLECTION,
                        ID.unique(),
                        {
                            ...data,
                            userId: currentUser.$id,
                        }
                    );
                    return { data: response as unknown as Category };
                } catch (error) {
                    return { error: { status: 500, data: error } };
                }
            },
            invalidatesTags: ['Categories'],
        }),
        updateCategory: builder.mutation<
            Category,
            { id: string; data: Partial<CategoryData> }
        >({
            async queryFn({ id, data }) {
                try {
                    const response = await databases.updateDocument(
                        DATABASES.ID,
                        DATABASES.CATEGORIES_COLLECTION,
                        id,
                        data
                    );
                    return { data: response as unknown as Category };
                } catch (error) {
                    return { error: { status: 500, data: error } };
                }
            },
            invalidatesTags: ['Categories'],
        }),
        deleteCategory: builder.mutation<void, string>({
            async queryFn(id) {
                try {
                    await databases.deleteDocument(
                        DATABASES.ID,
                        DATABASES.CATEGORIES_COLLECTION,
                        id
                    );
                    return { data: undefined };
                } catch (error) {
                    return { error: { status: 500, data: error } };
                }
            },
            invalidatesTags: ['Categories'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi; 