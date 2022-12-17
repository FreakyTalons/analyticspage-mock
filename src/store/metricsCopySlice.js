import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [],
};

export const metricsCopySlice = createSlice({
    name: "metricsCopy",
    initialState,
    reducers:{
        setMetricsCopy: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const {setMetricsCopy} = metricsCopySlice.actions;

export default metricsCopySlice.reducer;