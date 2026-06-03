import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  username?: string;
  avatarUrl?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

// Safely parse user from cookie
const getStoredUser = (): User | null => {
  try {
    const userStr = Cookies.get("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

const initialState: AuthState = {
  token: Cookies.get("token") || null,
  user: getStoredUser(),
  isAuthenticated: !!Cookies.get("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      // Save to cookies (expires in 7 days)
      Cookies.set("token", token, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      Cookies.set("user", JSON.stringify(action.payload), { expires: 7 });
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Remove cookies
      Cookies.remove("token");
      Cookies.remove("user");
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
