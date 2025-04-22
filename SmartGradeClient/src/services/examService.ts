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
    exampleExamPath: string // הוספה של הפרמטר החדש
): Promise<boolean> => {
    try {
        console.log(userId, subject, title, classNumber, exampleExamPath)
        const response = await axios.post(API_URL, { userId, subject, title, class: classNumber, exampleExamPath: exampleExamPath});
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

export const uploadExamUrl = async (
    examId: number,
    userId: number,
    studentName: string,
    fileUrl: string
): Promise<boolean> => {
    try {
        const response = await axios.post(`${UPLOAD_API_URL}/upload-url`, {
            examId,
            userId,
            studentName,
            fileUrl
        });
        console.log("הועלה בהצלחה:", response.data);
        return true;
    } catch (error) {
        console.error("שגיאה בהעלאת ה-URL:", error);
        throw error;
    }
};

export const fetchExamUploadsByExamId = async (examId: number): Promise<any[]> => {
    try {
        const response = await axios.get<any[]>(`${API_URL}/${examId}/uploads`);
        return response.data;
    } catch (error) {
        console.error("שגיאה בשליפת העלאות המבחן:", error);
        throw error;
    }
};

export const updateExam = async (
    examId: number,
    userId: number,
    subject: string,
    title: string,
    classNumber: string,
    exampleExamPath: string // הוספת שדה
): Promise<boolean> => {
    try {
        const response = await axios.put(`${API_URL}/${examId}`, {
            id: examId,
            userId: userId,
            subject: subject,
            title: title,
            class: classNumber,
            exampleExamPath: exampleExamPath, //הוספת שדה
        });
        return response.data;
    } catch (error) {
        console.error("שגיאה בעדכון המבחן:", error);
        throw error;
    }
};

export const deleteExam = async (examId: number): Promise<boolean> => {
    try {
        const response = await axios.delete(`${API_URL}/${examId}`);
        if (response.status === 200) {
            return true;
        } else {
            console.error("שגיאה במחיקת המבחן: קוד סטטוס לא תקין", response.status);
            throw new Error(`שגיאה במחיקת המבחן: קוד סטטוס לא תקין ${response.status}`);
        }
    } catch (error) {
        console.error("שגיאה במחיקת המבחן:", error);
        throw error;
    }
};;

// ... ייבוא וקונסטנטות קיימות ...

export const uploadStudentExam = async (
    examId: number,
    studentName: string,
    file: File
): Promise<boolean> => {
    try {
        const fileName = file.name;
        const presignedUrlResponse = await axios.get<{ url: string }>(`${UPLOAD_API_URL}/presigned-url`, {
            params: { fileName },
        });
        const presignedUrl = presignedUrlResponse.data.url;

        await axios.put(presignedUrl, file, {
            headers: {
                'Content-Type': file.type,
            },
        });

        const fileAccessUrl = presignedUrl.split('?')[0];

        const response = await axios.post(`${UPLOAD_API_URL}/upload-url`, {
            examId: examId,
            studentName: studentName,
            fileUrl: fileAccessUrl,
        });
        console.log("העלאת פתרון תלמיד בודד הצליחה:", response.data);
        return true;
    } catch (error) {
        console.error("שגיאה בהעלאת פתרון תלמיד:", error);
        throw error;
    }
};

export const bulkUploadExams = async (
    examId: number,
    filesWithNames: { file: File | null; studentName: string }[]
): Promise<boolean> => {
    try {
        for (const fileWithName of filesWithNames) {
            if (fileWithName.file && fileWithName.studentName) {
                const fileName = fileWithName.file.name;
                const presignedUrlResponse = await axios.get<{ url: string }>(`${UPLOAD_API_URL}/presigned-url`, {
                    params: { fileName },
                });
                const presignedUrl = presignedUrlResponse.data.url;

                await axios.put(presignedUrl, fileWithName.file, {
                    headers: {
                        'Content-Type': fileWithName.file.type,
                    },
                });

                const fileAccessUrl = presignedUrl.split('?')[0];

                await axios.post(`${UPLOAD_API_URL}/upload-url`, {
                    examId: examId,
                    studentName: fileWithName.studentName,
                    fileUrl: fileAccessUrl,
                });
            } else if (fileWithName.file && !fileWithName.studentName) {
                console.error("שגיאה: אנא הזן שם תלמיד עבור קובץ.", fileWithName.file.name);
                throw new Error("אנא הזן שם תלמיד עבור כל קובץ.");
            } else if (!fileWithName.file && fileWithName.studentName) {
                console.error("שגיאה: אנא בחר קובץ עבור שם התלמיד.", fileWithName.studentName);
                throw new Error("אנא בחר קובץ עבור השם שהוזן.");
            }
        }
        console.log("העלאה מרובה של פתרונות הצליחה.");
        return true;
    } catch (error) {
        console.error("שגיאה בהעלאה מרובה של פתרונות:", error);
        throw error;
    }
};

export const deleteExamUpload = async (uploadId: number): Promise<boolean> => {
    try {
        const response = await axios.delete(`${UPLOAD_API_URL}/${uploadId}`);
        if (response.status === 200) {
            console.log(`ההעלאה עם מזהה ${uploadId} נמחקה בהצלחה.`);
            return true;
        } else {
            console.error(`שגיאה במחיקת ההעלאה עם מזהה ${uploadId}: קוד סטטוס ${response.status}`);
            throw new Error(`שגיאה במחיקת ההעלאה: קוד סטטוס ${response.status}`);
        }
    } catch (error) {
        console.error("שגיאה במחיקת ההעלאה:", error);
        throw error;
    }
};

export const updateExamUpload = async (uploadId: number, studentName: string): Promise<boolean> => {
    try {
        const response = await axios.put(`${UPLOAD_API_URL}/${uploadId}`, {
            examId: 0, // צריך לשלוח ExamId אבל לא בטוח מה הערך הנכון כאן - בדוק בצד השרת
            studentName: studentName,
        });
        console.log(`ההעלאה עם מזהה ${uploadId} עודכנה בהצלחה.`);
        return true;
    } catch (error) {
        console.error("שגיאה בעדכון ההעלאה:", error);
        throw error;
    }
};