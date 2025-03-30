import React, { useEffect, useState, useContext } from "react";
import { fetchExamsByUser } from "../../services/examService";
import { UserContext } from "../../context/UserReducer";
import { Exam } from "../../models/Exam";
import { Link } from "react-router-dom";

const ExamList: React.FC = () => {
    const { user } = useContext(UserContext);
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const loadExams = async () => {
            try {
                if (!user.id) {
                    setError("משתמש לא מחובר");
                    setLoading(false);
                    return;
                }
                const examsData = await fetchExamsByUser(user.id);
                console.log("Fetched exams:", examsData);
                setExams(examsData);
            } catch (err) {
                setError("שגיאה בטעינת המבחנים");
            } finally {
                setLoading(false);
            }
        };

        loadExams();
    }, [user.id]);

    return (
        <div>
            <h2>רשימת המבחנים שלך</h2>
            {loading && <p>טוען...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && exams.length === 0 && <p>לא נמצאו מבחנים</p>}
            <ul>
                {exams.map((exam) => (
            <Link to={`/exam/${exam.id}`} key={exam.id}>
            <strong>{exam.title}</strong> - {exam.subject} (כיתה {exam.class})
             </Link>
                ))}
            </ul>
        </div>
    );
};

export default ExamList;
