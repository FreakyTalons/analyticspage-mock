import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    value:[
        {id:'clicks', min: 0,max: 0},
        {id:'requests', min: 0,max: 0},
        {id:'responses', min: 0,max: 0},
        {id:'impressions', min: 0,max: 0},
        {id:'revenue', min: 0,max: 0},
        {id:'fill_rate', min: 0,max: 0},
        {id:'CTR', min: 0,max: 0},
    ],
       
    
}

export const minMaxSlice = createSlice({
    name: 'minMax',
    initialState,
    reducers:{
        setMinMax: (state, action) =>
        {
            state.value = action.payload;
        },
    }
})

export const {setMinMax} = minMaxSlice.actions;
export default minMaxSlice.reducer; 