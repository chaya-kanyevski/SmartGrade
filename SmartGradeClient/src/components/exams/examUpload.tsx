import { useState } from "react";
import { getPresignedUrl } from "../../services/examService";
import axios from "axios";

const ExamUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const uploadFile = async () => {
        if (!file) {
            alert("נא לבחור קובץ להעלאה");
            return;
        }

        setUploading(true);
        try {
            // מקבלים URL חתום מהשרת
            const presignedUrl = await getPresignedUrl(file.name);
            
            // מעלים את הקובץ ל-S3
            await axios.put(presignedUrl, file, {
                headers: {
                    "Content-Type": file.type,
                },
            });
            
            setFileUrl(presignedUrl.split("?")[0]); // כתובת הגישה לקובץ (ללא פרמטרים)
            alert("✅ קובץ הועלה בהצלחה!");
        } catch (error) {
            console.error("שגיאה בהעלאת הקובץ:", error);
            alert("❌ שגיאה בהעלאה");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} disabled={uploading} />
            <button onClick={uploadFile} disabled={uploading || !file}>
                {uploading ? "מעלה..." : "העלה קובץ מבחן לדוגמא"}
            </button>
            {fileUrl && (
                <div>
                    <p>🔗 הקובץ הועלה בהצלחה!</p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">📂 פתח קובץ</a>
                </div>
            )}
        </div>
    );
};

export default ExamUpload;