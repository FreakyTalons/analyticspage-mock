import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [
    { name: "Date", disp: true, id: 'date', class:'left-align'},
    { name: "App", disp: true, id: 'app_id', class:'left-align'},
    { name: "Clicks", disp: false, id:'clicks', class:'right-align'},
    { name: "Ad Requests", disp: false, id:'requests', class:'right-align' },
    { name: "Ad Response", disp: false, id:'responses', class:'right-align' },
    { name: "Impressions", disp: false, id:'impressions', class:'right-align' },
    { name: "Revenue", disp: false, id:'revenue', class:'right-align' },
    { name: "Fill Rate", disp: false, id:'fill_rate', class:'right-align' },
    { name: "CTR", disp: false, id:'CTR', class:'right-align' },
  ],
};

export const metricsSlice = createSlice({
  name: "metrics",
  initialState,
  reducers: {
    setMetrics: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setMetrics } = metricsSlice.actions;

export default metricsSlice.reducer;
