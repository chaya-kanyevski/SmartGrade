export interface File {
  id: number;
  title: string;
  filePath ?: string;  
  tags: string[];
  type?: FileType;
  size?: number;
  description?: string;  
  date?: Date; 
  createdAt?: string;
}
// export interface File {
//     id: number;
//     title: string;
//     type?: FileType;
//     date?: Date; 
//     size?: number;
//     tags: string[];
//     filePath ?: string;
//     description?: string;
//   }

  // export interface FileDto {
  //   id: number; 
  //   title: string;
  //   filePath: string;
  //   tags?: string; 
  //   type?: FileType; // ניתן לנחש את הסוג מהכותרת
  //   size?: number; // גודל הקובץ, אם זמין
  //   description?: string;
  //   date?: Date; 
  //   createdAt?: string;
  // }
  
export type FileType = 'exam' | 'summary' | 'presentation' | 'lesson_plan' | 'quiz' | 'other';

export const fileTypeOptions: { value: FileType; label: string }[] = [
  { value: 'exam', label: 'מבחן' },
  { value: 'quiz', label: 'בוחן' },
  { value: 'lesson_plan', label: 'מערך שיעור' },
  { value: 'presentation', label: 'מצגת' },
  { value: 'summary', label: 'סיכום' },
  { value: 'other', label: 'אחר' },
];