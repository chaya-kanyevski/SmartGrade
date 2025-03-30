import React, { useState, useContext } from "react";
import { addExam, getPresignedUrl } from "../../services/examService"; // ייבוא הפונקציות
import { UserContext } from "../../context/UserReducer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddExam: React.FC = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState<{
        subject: string;
        title: string;
        classNumber: string;
        file: File | null | undefined;
    }>({
        subject: "",
        title: "",
        classNumber: "",
        file: null,
    });

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>) => {
        if (e.target.type === "file") {
            setFormData({ ...formData, file: (e.target.files?.[0] || null) as File | null });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user.id) {
            alert("שגיאה: משתמש לא מחובר");
            return;
        }

        if (!formData.subject || !formData.title || !formData.classNumber || !formData.file) {
            alert("אנא מלא את כל השדות והעלה קובץ.");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const presignedUrl = await getPresignedUrl(formData.file.name);
            await axios.put(presignedUrl, formData.file, {
                headers: {
                    "Content-Type": formData.file.type,
                },
            });

            // const fileAccessUrl: string = presignedUrl.split("?")[0];

            await addExam(user.id, formData.subject, formData.title, formData.classNumber); // הוספת fileAccessUrl
            alert("המבחן נוסף בהצלחה!");
            setFormData({ subject: "", title: "", classNumber: "", file: null });
        } catch (err) {
            console.error("שגיאה בהעלאת הקובץ:", err);
            setError("שגיאה בהעלאה");
        } finally {
            setUploading(false);
        }
    };

    const isSubmitDisabled = !formData.subject || !formData.title || !formData.classNumber || !formData.file || uploading;

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "400px", margin: "20px auto" }}>
            <h2>הוספת מבחן חדש</h2>
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
                    <label style={{ display: "block", marginBottom: "5px" }}>העלה קובץ:</label>
                    <input type="file" name="file" onChange={handleChange} required style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
                </div>
                <button type="submit" disabled={isSubmitDisabled} style={{ width: "100%", padding: "10px 15px", backgroundColor: isSubmitDisabled ? "#ccc" : "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: isSubmitDisabled ? "default" : "pointer" }}>
                    {uploading ? "מעלה..." : "הוסף מבחן"}
                </button>
            </form>
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>
    );
};

export default AddExam;