import axios from "axios";
import { Exam } from "../models/Exam";

const API_URL = "https://localhost:7276/api/Exams"
const UPLOAD_API_URL = "https://localhost:7276/api/ExamUpload";

export const fetchExamsByUser = async (userId: number): Promise<Exam[]> => {
    try {
        const response = await axios.get<Exam[]>(`${API_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("שגיאה בשליפת המבחנים:", error);
        return [];
    }
};

export const addExam = async (
    userId: number,
    subject: string,
    title: string,
    classNumber: string,
): Promise<boolean> => {
    try {
        console.log(userId, subject, title, classNumber)
        const response = await axios.post(API_URL, { userId, subject, title, class: classNumber});
        console.log(response)
        return response.data;
    } catch (error) {
        console.error("שגיאה בהוספת המבחן:", error);
        throw error;
    }
};

export const fetchExamById = async (examId: number): Promise<Exam> => {
    try {
        const response = await axios.get<Exam>(`${API_URL}/${examId}`);
        return response.data;
    } catch (error) {
        console.error("שגיאה בטעינת פרטי המבחן:", error);
        throw error;
    }
};

export const getPresignedUrl = async (fileName: string): Promise<string> => {
    try {
        console.log(`${UPLOAD_API_URL}/presigned-url?fileName=${fileName}`);

        const response = await axios.get<{ url: string }>(`${UPLOAD_API_URL}/presigned-url`, {
            params: { fileName },
        });
        console.log(response.data.url)
        return response.data.url;
    } catch (error) {
        console.error("שגיאה בקבלת ה-Presigned URL:", error);
        throw error;
    }
};
