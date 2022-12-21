import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dataCopy:[],
    dispClrFilter: false
}

export const clrFilterSlice = createSlice({
    name: 'clrFilter',
    initialState,
    reducers:
    {
        setDispClrFilter: (state) => {
            state.dispClrFilter = !state.dispClrFilter;
        },
        setDataCopy: (state, action) => {
            state.dataCopy = action.payload;
        },
    },
})

export const {setDispClrFilter, setDataCopy} = clrFilterSlice.actions;
export default clrFilterSlice.reducer;