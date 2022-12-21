import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  value: [],
  error: "",
};

export const fetchData = createAsyncThunk("store/fetchData", async (reqURL) => {
  const response = await axios
    .get(reqURL);
  return response.data.data;
});

const dataSlice = createSlice({
  name: "data",
  initialState,
  extraReducers: (bulider) => {
    bulider.addCase(fetchData.pending, (state) => {
        state.loading = true
    });
    bulider.addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false
        if(action.payload)
          {
            state.value = action.payload
            state.error = ""
          }
        else
            {
              state.value = []
              state.error = "no data received"
            }
        const d = new Date();
        sessionStorage.setItem('lastFetchTime', d.getTime())
    });
    bulider.addCase(fetchData.rejected, (state, action) => {
        state.loading = false
        state.value = []
        state.error = action.error.message
        const d = new Date();
        sessionStorage.setItem('lastRejectTime', d.getTime())
    });
  },
});

export default dataSlice.reducer;
