import React, { createContext, useContext, useState } from 'react';
import { ExamFileType, ExamFolderType } from '../models/Exam';
import initialData from '../data/initialData';

interface ExamContextType {
    data: (ExamFileType | ExamFolderType)[];
    setData: React.Dispatch<React.SetStateAction<(ExamFileType | ExamFolderType)[]>>;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<(ExamFileType | ExamFolderType)[]>(initialData);

    return <ExamContext.Provider value={{ data, setData }}>{children}</ExamContext.Provider>;
};

export const useExamContext = () => {
    const context = useContext(ExamContext);
    if (!context) {
        throw new Error('useExamContext must be used within an ExamProvider');
    }
    return context;
};