import { ExamFileType, ExamFolderType } from '../models/Exam';

const initialData: (ExamFileType | ExamFolderType)[] = [
    {
        id: 1,
        userId: 0,
        folderName: "מתמטיקה",
        type: "folder",
        children: [
            {
                id: 2,
                userId: 0,
                title: "מבחן בגרות",
                subject: "מתמטיקה",
                created_at: new Date(),
                class: 12,
                examPath: "/exams/math/bagrut.pdf",
                type: "file",
                parentId: 1
            },
            {
                id: 3,
                userId: 0,
                folderName: "תרגולים",
                type: "folder",
                parentId: 1,
                children: [
                    {
                        id: 4,
                        title: "תרגול פונקציות",
                        subject: "מתמטיקה",
                        userId: 2,
                        created_at: new Date(),
                        class: 11,
                        examPath: "/exams/math/functions.pdf",
                        type: "file",
                        parentId: 3
                    }
                ]
            }
        ]
    },
    {
        id: 5,
        userId: 0,
        folderName: "פיזיקה",
        type: "folder",
        children: [
            {
                id: 6,
                title: "מבחן כוח",
                subject: "פיזיקה",
                userId: 3,
                created_at: new Date(),
                class: 10,
                examPath: "/exams/physics/force.pdf",
                type: "file",
                parentId: 5
            }
        ]
    }
];

export default initialData;
