import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/api";

const savedUser = localStorage.getItem("gc_user");
const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: localStorage.getItem("gc_token"),
  status: "idle",
  error: ""
};

export const login = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", payload);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const register = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/register", payload);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Registration failed");
  }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.put("/users/me", payload);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Profile update failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("gc_token");
      localStorage.removeItem("gc_user");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        localStorage.setItem("gc_user", JSON.stringify(action.payload));
      })
      .addMatcher((action) => action.type.startsWith("auth/") && action.type.endsWith("/pending"), (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addMatcher((action) => ["auth/login/fulfilled", "auth/register/fulfilled"].includes(action.type), (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem("gc_token", action.payload.token);
        localStorage.setItem("gc_user", JSON.stringify(action.payload.user));
      })
      .addMatcher((action) => action.type.startsWith("auth/") && action.type.endsWith("/rejected"), (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
