type UserState = { user: User | null; isLoading: boolean; error: string | null | undefined };

type RootState = import("./../store").RootState;

type AppDispatch = import("./../store").AppDispatch;
