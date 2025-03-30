import React, { useEffect, useState, useContext } from "react";
import { fetchExamsByUser, deleteExam } from "../../services/examService"; // ייבוא deleteExam
import { UserContext } from "../../context/UserReducer";
import { Exam } from "../../models/Exam";
import { Link, useNavigate } from "react-router-dom";

const ExamList: React.FC = () => {
    const { user } = useContext(UserContext);
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

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

    const handleDeleteExam = async (examId: number) => {
        try {
            if (window.confirm("האם אתה בטוח שברצונך למחוק מבחן זה?")) {
                await deleteExam(examId);
                alert("המבחן נמחק בהצלחה!");
                // רענון רשימת המבחנים לאחר מחיקה
                const examsData = await fetchExamsByUser(user.id);
                setExams(examsData);
            }
        } catch (err) {
            setError("שגיאה במחיקת המבחן");
        }
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "600px", margin: "20px auto" }}>
            <h2>רשימת המבחנים שלך</h2>
            {loading && <p>טוען...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && exams.length === 0 && <p>לא נמצאו מבחנים</p>}
            <ul style={{ listStyleType: "none", padding: 0 }}>
                {exams.map((exam) => (
                    <li key={exam.id} style={{ marginBottom: "10px", border: "1px solid #eee", padding: "10px", borderRadius: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                            <Link to={`/exam/${exam.id}`} style={{ textDecoration: "none", color: "#333" }}>
                                <strong>{exam.title}</strong> - {exam.subject} (כיתה {exam.class})
                            </Link>
                            <div>
                                <button onClick={() => navigate(`/edit-exam/${exam.id}`)} style={{ padding: "8px 12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "5px" }}>
                                    ערוך
                                </button>
                                <button onClick={() => handleDeleteExam(exam.id)} style={{ padding: "8px 12px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                                    מחק
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExamList;