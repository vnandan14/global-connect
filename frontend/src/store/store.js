import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import socialReducer from "../features/socialSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    social: socialReducer
  }
});
