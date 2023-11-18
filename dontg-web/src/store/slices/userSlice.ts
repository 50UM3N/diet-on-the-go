import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        isLoading: true,
        error: null,
        user: null,
    } as UserState,
    reducers: {
        setUser(state, action) {
            // state e previous data and action e user data
            const user = action.payload;
            state.user = user;
            state.isLoading = false;
        },
        loadingUser(state, action) {
            state.isLoading = action.payload;
        },
        updateUser(state, action) {
            const userData = action.payload;
            state.user = { ...state.user, ...userData };
            state.isLoading = false;
        },
    },
});

export const { setUser, loadingUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
