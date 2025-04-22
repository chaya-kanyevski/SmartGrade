import React, { useState, useContext } from "react";
import { addExam, getPresignedUrl } from "../../services/examService";
import { UserContext } from "../../context/UserReducer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface AddExamResponse {
    success: boolean;
    examId?: number;
    error?: string;
}

const AddExam: React.FC = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        subject: "",
        title: "",
        classNumber: "",
        file: null as File | null | undefined,
    });

    const [uploading, setUploading] = useState(false);
    const [s3UploadError, setS3UploadError] = useState<string | null>(null);
    const [addExamError, setAddExamError] = useState<string | null>(null);
    const [examAddedSuccessfully, setExamAddedSuccessfully] = useState(false);
    const [newExamId, setNewExamId] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.type === "file" ? (e.target.files?.[0] || null) : e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user.id || !formData.subject || !formData.title || !formData.classNumber || !formData.file) {
            alert("אנא מלא את כל השדות והעלה קובץ.");
            return;
        }

        setUploading(true);
        setS3UploadError(null);
        setAddExamError(null);

        let fileAccessUrl: string | null = null;
        let newExamIdResult: number | null = null;
        let s3UploadSuccessful = false;

        try {
            const presignedUrl = await getPresignedUrl(formData.file.name);
            await axios.put(presignedUrl, formData.file, {
                headers: { "Content-Type": formData.file.type },
            });
            fileAccessUrl = presignedUrl.split("?")[0];
            s3UploadSuccessful = true;
        } catch (err: any) {
            console.error("שגיאה בהעלאת הקובץ ל-S3:", err);
            setS3UploadError("שגיאה בהעלאת הקובץ.");
        }

        if (s3UploadSuccessful && fileAccessUrl) {
            try {
                const addExamResponse = await addExam(user.id, formData.subject, formData.title, formData.classNumber, fileAccessUrl);
                console.log("תגובת addExam:", addExamResponse);
                if (addExamResponse.data && typeof addExamResponse.data === 'object' && addExamResponse.data.examId) {
                    newExamIdResult = addExamResponse.data.examId;
                    setExamAddedSuccessfully(true);
                    setNewExamId(newExamIdResult);
                    console.log("המבחן נוסף בהצלחה, ID:", newExamId);
                    alert("המבחן נוסף בהצלחה!");
                    setFormData({ subject: "", title: "", classNumber: "", file: null });
                } else {
                    setAddExamError("שגיאה בהוספת המבחן.");
                    if (addExamResponse.data && addExamResponse.data.error) {
                        setAddExamError(`שגיאה בהוספת המבחן: ${addExamResponse.data.error}`);
                    } else {
                        setAddExamError("שגיאה בהוספת המבחן: תגובה לא תקינה מהשרת.");
                    }
                }
            } catch (err: any) {
                console.error("שגיאה בהוספת פרטי המבחן:", err);
                setAddExamError("שגיאה בהוספת המבחן.");
            }
        }

        setUploading(false);
    };

    const handleNavigateToUpload = () => {
        if (newExamId !== null && examAddedSuccessfully) {
            navigate(`/upload-student-exam/${newExamId}`);
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
                    <label style={{ display: "block", marginBottom: "5px" }}>העלה קובץ לדוגמה:</label>
                    <input type="file" name="file" onChange={handleChange} required style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
                </div>
                <button type="submit" disabled={isSubmitDisabled}>
                    {uploading ? "מעלה..." : "הוסף מבחן"}
                </button>
            </form>
            {s3UploadError && <p style={{ color: "red", marginTop: "10px" }}>{s3UploadError}</p>}
            {addExamError && <p style={{ color: "red", marginTop: "10px" }}>{addExamError}</p>}

            {examAddedSuccessfully && newExamId !== null && (
                <button onClick={handleNavigateToUpload} style={{ marginTop: "20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", padding: "10px 15px" }}>
                    העלה פתרונות תלמידים למבחן זה
                </button>
            )}
        </div>
    );
};

export default AddExam;