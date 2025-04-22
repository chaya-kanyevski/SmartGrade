import React, { useState } from 'react';
import { bulkUploadExams } from '../../services/examService'; // ייבוא הפונקציה משירות
import { useNavigate, useParams } from 'react-router-dom';

interface FileWithStudentName {
    file: File | null;
    studentName: string;
}

const UploadStudentExam: React.FC = () => {
    const { examId: examIdParam } = useParams(); // חילוץ הפרמטר examId מהנתיב
    const examId = examIdParam ? parseInt(examIdParam, 10) : null; // המרה למספר
    const [filesWithNames, setFilesWithNames] = useState<FileWithStudentName[]>([{ file: null, studentName: '' }]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    // ... (שאר הקוד של הקומפוננטה: handleFileChange, handleNameChange, addFileInput, removeFileInput)

    const handleBulkUpload = async () => {
        setUploading(true);
        setError(null);
        setSuccessMessage(null);

        if (examId === null) {
            setError('מזהה מבחן לא תקין.');
            setUploading(false);
            return;
        }

        try {
            await bulkUploadExams(examId, filesWithNames.filter(fwn => fwn.file && fwn.studentName));
            setSuccessMessage('הקבצים הועלו בהצלחה!');
            setFilesWithNames([{ file: null, studentName: '' }]);
            navigate(`/exams/${examId}`);
        } catch (err: any) {
            setError(`שגיאה בהעלאת הקבצים: ${err.message}`);
            console.error('שגיאה בהעלאת קבצים:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        if (examId !== null) {
            navigate(`/exams/${examId}`);
        } else {
            // טפל במקרה שבו אין examId תקין
            console.error("מזהה מבחן לא זמין לסגירה.");
            // אולי תרצה לנווט למקום אחר או להציג הודעה
        }
    };

    return (
        <div style={{ /* סגנון */ }}>
            <h3>העלאה מרובה של פתרונות</h3>
            {/* ... (שאר התצוגה) */}
            <button onClick={handleBulkUpload} disabled={uploading || filesWithNames.some(fwn => !fwn.file || !fwn.studentName)}>
                {uploading ? 'מעלה...' : 'העלה את כל הקבצים'}
            </button>
            <button onClick={handleClose}>סגור</button>
        </div>
    );
};

export default UploadStudentExam;