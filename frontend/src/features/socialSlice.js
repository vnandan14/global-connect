import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/api";

export const loadFeed = createAsyncThunk("social/loadFeed", async () => {
  const { data } = await api.get("/posts/feed");
  return data;
});

export const createPost = createAsyncThunk("social/createPost", async (content) => {
  const { data } = await api.post("/posts", { content });
  return data;
});

export const toggleLike = createAsyncThunk("social/toggleLike", async (id) => {
  const { data } = await api.post(`/posts/${id}/like`);
  return data;
});

export const searchPeople = createAsyncThunk("social/searchPeople", async (q) => {
  const { data } = await api.get(`/users/search?q=${encodeURIComponent(q)}`);
  return data;
});

export const loadConnections = createAsyncThunk("social/loadConnections", async () => {
  const { data } = await api.get("/connections");
  return data;
});

export const sendRequest = createAsyncThunk("social/sendRequest", async (id) => {
  const { data } = await api.post(`/connections/request/${id}`);
  return { id, data };
});

export const acceptRequest = createAsyncThunk("social/acceptRequest", async (id) => {
  const { data } = await api.post(`/connections/accept/${id}`);
  return { id, data };
});

export const loadJobs = createAsyncThunk("social/loadJobs", async (q = "") => {
  const { data } = await api.get(`/jobs?q=${encodeURIComponent(q)}`);
  return data;
});

export const createJob = createAsyncThunk("social/createJob", async (job) => {
  const { data } = await api.post("/jobs", job);
  return data;
});

export const applyJob = createAsyncThunk("social/applyJob", async (id) => {
  const { data } = await api.post(`/jobs/${id}/apply`);
  return data.job;
});

const socialSlice = createSlice({
  name: "social",
  initialState: {
    posts: [],
    people: [],
    connections: [],
    requests: [],
    jobs: [],
    status: "idle"
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFeed.fulfilled, (state, action) => {
        state.posts = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) => (post._id === action.payload._id ? { ...post, likes: action.payload.likes } : post));
      })
      .addCase(searchPeople.fulfilled, (state, action) => {
        state.people = action.payload;
      })
      .addCase(loadConnections.fulfilled, (state, action) => {
        state.connections = action.payload.connections || [];
        state.requests = action.payload.connectionRequests || [];
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter((user) => user._id !== action.payload.id);
      })
      .addCase(loadJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload);
      })
      .addMatcher((action) => action.type.startsWith("social/") && action.type.endsWith("/pending"), (state) => {
        state.status = "loading";
      })
      .addMatcher((action) => action.type.startsWith("social/") && action.type.endsWith("/fulfilled"), (state) => {
        state.status = "succeeded";
      });
  }
});

export default socialSlice.reducer;
