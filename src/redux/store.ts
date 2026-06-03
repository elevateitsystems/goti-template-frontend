import { configureStore } from "@reduxjs/toolkit";
import { mainApi } from "./api/mainApi";
import sportReducer from "./features/sportSlice";
import parlayReducer from "./features/parlaySlice";
import alertsReducer from "./features/alertsSlice";
import betTrackerReducer from "./features/betTrackerSlice";
import authReducer from "./features/authSlice";

export const store = configureStore({
  reducer: {
    sport: sportReducer,
    parlay: parlayReducer,
    alerts: alertsReducer,
    betTracker: betTrackerReducer,
    auth: authReducer,
    [mainApi.reducerPath]: mainApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(mainApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
