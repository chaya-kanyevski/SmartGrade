import { configureStore } from "@reduxjs/toolkit";
import examReducer from "./examSlice";

const store = configureStore({
    reducer: {
        exams: examReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
