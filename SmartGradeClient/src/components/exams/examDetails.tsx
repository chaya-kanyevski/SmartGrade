import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchExamById } from "../../services/examService";
import { Exam } from "../../models/Exam";

const ExamDetails: React.FC = () => {
    const { examId } = useParams<{ examId: string }>(); // קבלת ה-ID מה-URL
    const [exam, setExam] = useState<Exam | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadExam = async () => {
            try {
                if (!examId) return;
                const examData = await fetchExamById(Number(examId));
                setExam(examData);
            } catch (err) {
                setError("שגיאה בטעינת פרטי המבחן");
            }
        };

        loadExam();
    }, [examId]);

    if (error) return <p>{error}</p>;
    if (!exam) return <p>טוען...</p>;

    return (
        <div>
            <h2>פרטי המבחן</h2>
            <p><strong>נושא:</strong> {exam.subject}</p>
            <p><strong>כותרת:</strong> {exam.title}</p>
            <p><strong>כיתה:</strong> {exam.class}</p>
        </div>
    );
};

export default ExamDetails;
