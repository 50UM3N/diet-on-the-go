import { UserState } from "@/types/store.type";
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  } as UserState,
  reducers: {
    logout(state) {
      localStorage.removeItem("token");
      state.user = null;
    },
    login(state, action) {
      const user = action.payload;
      state.user = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    },
    updateUser(state, action) {
      const userData = action.payload;
      state.user = { ...state.user, ...userData };
    },
  },
});

export const { updateUser, login, logout } = userSlice.actions;

export default userSlice.reducer;
