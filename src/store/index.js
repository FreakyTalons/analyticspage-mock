import { configureStore } from "@reduxjs/toolkit";
import metricsReducer from "./metricsSlice";
import dataReducer from "./dataSlice";
import requestReducer from "./requestSlice";
import metricsCopyReducer from "./metricsCopySlice";
import appNameReducer from "./appNameSlice";


export const store = configureStore({
  reducer: {
    metrics: metricsReducer,
    metricsCopy: metricsCopyReducer,
    data: dataReducer,
    reqs: requestReducer,
    appName: appNameReducer,

  },
});