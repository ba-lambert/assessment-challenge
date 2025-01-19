import { configureStore } from '@reduxjs/toolkit';
import { categoryApi } from './services/categoryApi';
import { accountApi } from './services/accountApi';
import { transactionApi } from './services/transactionApi';
import { budgetApi } from './services/budgetApi';

export const store = configureStore({
    reducer: {
        [categoryApi.reducerPath]: categoryApi.reducer,
        [accountApi.reducerPath]: accountApi.reducer,
        [transactionApi.reducerPath]: transactionApi.reducer,
        [budgetApi.reducerPath]: budgetApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(categoryApi.middleware)
            .concat(accountApi.middleware)
            .concat(budgetApi.middleware)
            .concat(transactionApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 