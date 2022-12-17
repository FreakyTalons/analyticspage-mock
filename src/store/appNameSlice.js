import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    value: [],
    error: '',
}

//http://go-dev.greedygame.com/v3/dummy/apps

export const fetchAppData = createAsyncThunk ("store/fetchAppData", async () => {
    const response = await axios
        .get('http://go-dev.greedygame.com/v3/dummy/apps')
    return response.data.data;
});

const appNameSlice = createSlice ({
    name: 'appName',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchAppData.pending, (state) => {
            state.loading = true
        });
        builder.addCase(fetchAppData.fulfilled, (state, action) =>{
            state.loading =false
            state.value = action.payload
            state.error = ''
        });
        builder.addCase(fetchAppData.rejected, (state, action) => {
            state.loading = false
            state.value = []
            state.error = action.error.message
        });
    },
});

export default appNameSlice.reducer;