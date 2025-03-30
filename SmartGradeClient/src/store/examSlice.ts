import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchExamsByUser } from "../services/examService";
import { Exam } from "../models/Exam";

interface ExamState {
    exams: Exam[];
    loading: boolean;
    error: string | null;
}

// מצב התחלתי
const initialState: ExamState = {
    exams: [],
    loading: false,
    error: null,
};

// פעולה אסינכרונית לקבלת מבחנים מהשרת
export const fetchExams = createAsyncThunk(
    "exams/fetchExams",
    async (userId: number, thunkAPI) => {
        try {
            return await fetchExamsByUser(userId);
        } catch (error) {
            return thunkAPI.rejectWithValue("Failed to fetch exams");
        }
    }
);

const examSlice = createSlice({
    name: "exams",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExams.fulfilled, (state, action) => {
                state.loading = false;
                state.exams = action.payload;
            })
            .addCase(fetchExams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default examSlice.reducer;
