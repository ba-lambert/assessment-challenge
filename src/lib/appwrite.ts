import { Account, Client, Databases, ID, Query } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('678be903002fd54be3f9'); 

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASES = {
    ID: '678c29f600286c7620d8',
    ACCOUNTS_COLLECTION: '678c31ce001a69f1b845',
    CATEGORIES_COLLECTION: '678cb04000103f990c26',
    TRANSACTIONS_COLLECTION: '678cb7e10032e1d3b405',
    BUDGETS_COLLECTION:'678cd1af00068623a1c0'
};

export type AccountType = 'mobile_money' | 'cash' | 'bank';

export interface AccountData {
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  description?: string;
  accountNumber?: string;
  bankName?: string;
  mobileProvider?: string;
}

export interface CategoryData {
    name: string;
    description?: string;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface TransactionData {
    userId: string;
    categoryId: string;
    accountId: string;
    toAccountId?: string;
    type: TransactionType;
    amount: number;
    description?: string;
    date: string;
}

export const accountService = {
    signIn: async (email: string, password: string) => {
        try {
            try {
                const currentSession = await account.getSession('current');
                if (currentSession) {
                    return currentSession;
                }
            } catch (error) {
                
            }
            const session = await account.createEmailPasswordSession(email, password);
            return session;
        } catch (error) {
            throw error;
        }
    },

    signUp: async (email: string, password: string, username: string) => {
        try {
            const user = await account.create(
                ID.unique(),
                email,
                password,
                username
            );
            return user;
        } catch (error) {
            throw error;
        }
    },

    resetPassword: async (email: string) => {
        try {
            await account.createRecovery(
                email,
                'http://localhost:5173/auth/reset-password-confirm'
            );
        } catch (error) {
            throw error;
        }
    },

    signOut: async () => {
        try {
            await account.deleteSession('current');
            window.location.href = '/auth/signin';
        } catch (error) {
            throw error;
        }
    },

    createAccount: async (data: Omit<AccountData, 'userId'>) => {
        const currentUser = await account.get();
        return databases.createDocument(
            DATABASES.ID,
            DATABASES.ACCOUNTS_COLLECTION,
            ID.unique(),
            {
                ...data,
                userId: currentUser.$id,
            }
        );
    },

    getUserAccounts: async () => {
        const currentUser = await account.get();
        return databases.listDocuments(
            DATABASES.ID,
            DATABASES.ACCOUNTS_COLLECTION,
            [
                Query.equal('userId', currentUser.$id)
            ]
        );
    },
};

export const categoryService = {
    createCategory: async (data: CategoryData) => {
        const currentUser = await account.get();
        return databases.createDocument(
            DATABASES.ID,
            DATABASES.CATEGORIES_COLLECTION,
            ID.unique(),
            {
                ...data,
                userId: currentUser.$id,
            }
        );
    },
}; 