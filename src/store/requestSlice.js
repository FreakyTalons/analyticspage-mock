import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        fetchable: true,
        URL: "https://cors-anywhere.herokuapp.com/http://go-dev.greedygame.com/v3/dummy/report?startDate&endDate="
    }
}

//https://cors-anywhere.herokuapp.com/

export const requestSlice = createSlice({
    name: 'reqs',
    initialState,
    reducers: {
        setReq: (state, action) => {
            state.value.URL = "https://cors-anywhere.herokuapp.com/http://go-dev.greedygame.com/v3/dummy/report?startDate="+action.payload.startDate+"&endDate="+action.payload.endDate;
        },
        setFetchable: (state) =>
        {
            state.value.fetchable = !state.value.fetchable;
        }
    }
})

export const {setReq, setFetchable} = requestSlice.actions;

export default requestSlice.reducer;