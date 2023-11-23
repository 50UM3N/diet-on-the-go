import { User } from "./index.type";

export type UserState = { user: User | null; isLoading: boolean; error: string | null | undefined };

export type RootState = import("../store").RootState;

export type AppDispatch = import("../store").AppDispatch;
