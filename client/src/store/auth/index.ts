import authService from "@/services/auth";
import { User } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
// import favoriteService from "@/services/favorite";

export interface AuthState {
  user: null | User;
  // favorites: string[];
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  // favorites: [],
  loading: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCurrentUserAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCurrentUserAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      // state.favorites = action.payload.favorites || [];
    });
    builder.addCase(getCurrentUserAsync.rejected, (state) => {
      state.loading = false;
      state.user = null;
    });
    builder.addCase(logoutAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.user = null;
      // state.favorites = [];
      state.loading = false;
    });
    builder.addCase(logoutAsync.rejected, (state) => {
      state.loading = false;
    });
    // builder.addCase(getFavAsync.fulfilled, (state, action) => {
    //   console.log(action.payload);
    //   state.favorites = action.payload;
    // });
  },
});

export const getCurrentUserAsync = createAsyncThunk(
  "auth/getCurrentUserAsync",
  async () => {
    const { data } = await authService.getCurrentUser();
    return data.user || null;
  }
);

// export const getFavAsync = createAsyncThunk("auth/getFavAsync", async () => {
//   const { data } = await favoriteService.getAll();
//   return data.favorites;
// });

export const logoutAsync = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

export const {} = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
