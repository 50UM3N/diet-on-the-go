import { UserInfo } from "./index.type";

export type UserState = { user: UserInfo | null; isLoading: boolean; error: string | null | undefined };

export type RootState = import("../store").RootState;

export type AppDispatch = import("../store").AppDispatch;
