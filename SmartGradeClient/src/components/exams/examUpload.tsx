import { useState } from "react";
import { getPresignedUrl, uploadExamUrl } from "../../services/examService";
import axios from "axios";

interface ExamUploadProps {
    examId: number;
}

const ExamUpload: React.FC<ExamUploadProps> = ({ examId }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [studentName, setStudentName] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
            setError(null);
        }
    };

    const uploadFile = async () => {
        if (!file || !userId || !studentName) {
            setError("נא לבחור קובץ, להזין מזהה משתמש ושם תלמיד");
            return;
        }

        setUploading(true);
        setError(null);
        try {
            const presignedUrl = await getPresignedUrl(file.name);
            await axios.put(presignedUrl, file, {
                headers: {
                    "Content-Type": file.type,
                },
            });

            const fileAccessUrl = presignedUrl.split("?")[0];
            setFileUrl(fileAccessUrl);

            await uploadExamUrl(examId, userId, studentName, fileAccessUrl);

            alert("✅ קובץ הועלה בהצלחה!");
        } catch (err) {
            console.error("שגיאה בהעלאת הקובץ:", err);
            setError("❌ שגיאה בהעלאה");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "400px", margin: "20px auto" }}>
            <input type="file" onChange={handleFileChange} disabled={uploading} style={{ marginBottom: "10px" }} />
            <input type="number" placeholder="מזהה משתמש" value={userId || ""} onChange={(e) => setUserId(Number(e.target.value))} style={{ marginBottom: "10px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
            <input type="text" placeholder="שם תלמיד" value={studentName} onChange={(e) => setStudentName(e.target.value)} style={{ marginBottom: "10px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
            <button onClick={uploadFile} disabled={uploading || !file || !userId || !studentName} style={{ padding: "10px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                {uploading ? "מעלה..." : "העלה קובץ מבחן לדוגמא"}
            </button>
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
            {fileUrl && (
                <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#d4edda", border: "1px solid #c3e6cb", borderRadius: "4px" }}>
                    <p style={{ color: "#155724" }}> הקובץ הועלה בהצלחה!</p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "none" }}> פתח קובץ</a>
                </div>
            )}
        </div>
    );
};

export default ExamUpload;