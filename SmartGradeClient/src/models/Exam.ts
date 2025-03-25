import { User } from "./User";

export type Exam = {
    id: number,
    userId: number | undefined,
    subject: string,
    title : string,
    created_at : Date,
    class : number,
    examPath: string
}
export type ExamFolderType={
    id: number,
    folderName: string,
    type: 'folder',
    parentId?: number;
    children?: (ExamFileType | ExamFolderType)[]; 
}
export type ExamFileType = Exam & {
    parentId?: number;
    type: 'file' | 'folder';
}

export type StudentExamType = Exam & {
    studentDetails: Partial<User> | null;
    grade?: number | undefined;
    evaluation?: string;
};