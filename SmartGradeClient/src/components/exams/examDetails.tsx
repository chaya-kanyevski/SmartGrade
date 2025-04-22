import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchExamById, fetchExamUploadsByExamId } from "../../services/examService";
import { Exam, ExamUpload } from "../../models/Exam";

const ExamDetails: React.FC = () => {
    const { examId } = useParams<{ examId: string }>();
    const [exam, setExam] = useState<Exam | null>(null);
    const [examUploads, setExamUploads] = useState<ExamUpload[]>([]);
    const [error, setError] = useState("");
    const [uploadsError, setUploadsError] = useState("");

    useEffect(() => {
        const loadExam = async () => {
            try {
                if (!examId) {
                    setError("מזהה מבחן לא תקין");
                    return;
                }
                console.log("examId:", examId);
                const examIdNumber = Number(examId);

                if (isNaN(examIdNumber)) {
                    setError("מזהה מבחן לא תקין");
                    return;
                }

                const examData = await fetchExamById(examIdNumber);
                setExam(examData);

                try {
                    const uploads = await fetchExamUploadsByExamId(examIdNumber);
                    setExamUploads(uploads);
                } catch (uploadsErr) {
                    setUploadsError("לא נמצאו העלאות עבור מבחן זה.");
                    console.error("שגיאה בטעינת העלאות:", uploadsErr);
                }
            } catch (err) {
                setError("שגיאה בטעינת פרטי המבחן");
                console.error(err);
            }
        };

        loadExam();
    }, [examId]);

    if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;
    if (!exam) return <p style={{ padding: "20px" }}>טוען...</p>;

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "600px", margin: "20px auto" }}>
            <h2>פרטי המבחן</h2>
            <p><strong>נושא:</strong> {exam.subject}</p>
            <p><strong>כותרת:</strong> {exam.title}</p>
            <p><strong>כיתה:</strong> {exam.class}</p>
            {exam.exampleExamPath && (
                <p>
                    <strong>מבחן לדוגמה:</strong>
                    <a href={exam.exampleExamPath} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", marginLeft: "5px" }}>
                        פתח קובץ
                    </a>
                </p>
            )}
    
            <h3>העלאות תלמידים:</h3>
            {uploadsError && <p style={{ color: "red" }}>{uploadsError}</p>}
            <ul style={{ listStyleType: "none", padding: 0 }}>
                {examUploads.map(upload => {
                    if (!upload.filePath) {
                        return <li key={upload.id} style={{ marginBottom: "10px" }}>שם תלמיד: {upload.studentName}, לא קיים קישור להורדה</li>;
                    }
    
                    const fileName = upload.filePath.substring(upload.filePath.lastIndexOf('/') + 1);
                    const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
    
                    return (
                        <li key={upload.id} style={{ marginBottom: "10px" }}>
                            שם תלמיד: {upload.studentName},
                            קישור: <a href={upload.filePath} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>{fileName} ({fileType})</a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ExamDetails;