import { User } from "./User";

export interface ExamUpload {
    id: number;
    submissionNumber: number;
    userId: number;
    examId: number;
    studentName: string;
    filePath: string;
    uploadDate: string; // או Date, תלוי בפורמט של ה-API
    score: number;
}

export interface Exam {
    id: number;
    userId: number;
    subject: string;
    title: string;
    createdAt: string; // או Date, תלוי בפורמט של ה-API
    class: string;
    questions: any[]; // החלף בטיפוס מתאים לשאלות
    exampleExamPath: string;
    examUploads: ExamUpload[]; // הוספת שדה זה
}

export type ExamFolderType={
    id: number,
    userId: number,
    folderName: string,
    type: 'folder',
    parentId?: number;
    children?: (ExamFileType | ExamFolderType)[]; 
}
export type ExamFileType = Exam & {
    parentId?: number;
    userId: number,
    type: 'file' | 'folder';
}

export type StudentExamType = Exam & {
    studentDetails: Partial<User> | null;
    grade?: number | undefined;
    evaluation?: string;
};