import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchExamById, updateExam } from "../../services/examService";
import { UserContext } from "../../context/UserReducer";

const EditExam: React.FC = () => {
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        subject: "",
        title: "",
        classNumber: "",
        exampleExamPath: "", // הוספת שדה
    });

    const { user } = useContext(UserContext); // הוספת user

    useEffect(() => {
        const loadExam = async () => {
            if (!examId) return;
            try {
                const examData = await fetchExamById(Number(examId));
                setFormData({
                    subject: examData.subject,
                    title: examData.title,
                    classNumber: examData.class,
                    exampleExamPath: examData.exampleExamPath, // הוספת שדה
                });
            } catch (error) {
                console.error("שגיאה בטעינת פרטי המבחן:", error);
                alert("שגיאה בטעינת פרטי המבחן. נסה שוב.");
            }
        };
        loadExam();
    }, [examId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!examId) return;
        try {
            await updateExam(
                Number(examId),
                user.id,
                formData.subject,
                formData.title,
                formData.classNumber,
                formData.exampleExamPath
            );
            alert("המבחן עודכן בהצלחה!");
            navigate(`/exam/${examId}`);
        } catch (error) {
            console.error("שגיאה בעדכון המבחן:", error);
            alert("שגיאה בעדכון המבחן. נסה שוב.");
        }
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "400px", margin: "20px auto" }}>
            <h2>ערוך מבחן</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>נושא:</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} required style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>כותרת:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>כיתה:</label>
                    <input type="text" name="classNumber" value={formData.classNumber} onChange={handleChange} required style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>נתיב מבחן לדוגמה:</label>
                    <input type="text" name="exampleExamPath" value={formData.exampleExamPath} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
                </div>
                <button type="submit" style={{ width: "100%", padding: "10px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>שמור שינויים</button>
            </form>
        </div>
    );
};

export default EditExam;