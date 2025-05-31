import React, { useState, useContext } from "react";
import { getPresignedUrl, uploadFileUrl } from "../../services/fileService"; 
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, FileIcon } from 'lucide-react';
import { UserContext } from "@/context/UserReducer";

interface UploadSolutionFileProps {
  fileId: number; 
  onSolutionUploaded: () => void; 
  onClose: () => void; 
}

const UploadFile: React.FC<UploadSolutionFileProps> = ({ fileId, onSolutionUploaded, onClose }) => {
  const { user } = useContext(UserContext);

  const [file, setFile] = useState<File | null>(null);
  const [studentName, setStudentName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !studentName.trim() || !user.id) {
      setError("נא לבחור קובץ, להזין שם תלמיד ולהיות מחובר.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const presignedUrl = await getPresignedUrl(file.name);
      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
      });
      const solutionUrl = presignedUrl.split("?")[0];
      await uploadFileUrl(fileId, user.id, studentName, solutionUrl);

      setSuccessMessage("✅ קובץ הפתרון הועלה בהצלחה!");
      onSolutionUploaded(); 
      onClose(); 
    } catch (err: any) {
      console.error("שגיאה בהעלאת קובץ הפתרון:", err);
      setError("❌ שגיאה בהעלאה: " + (err instanceof Error ? err.message : "נסה שוב."));
    } finally {
      setIsUploading(false);
      setFile(null); 
      setStudentName(""); 
    }
  };

  const isSubmitDisabled = !file || !studentName.trim() || isUploading;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">העלאת קובץ פתרון עבור קובץ ID: {fileId}</h3>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {successMessage && <p className="text-green-500 text-sm mb-2">{successMessage}</p>}

      <div className={`border-2 border-dashed ${file ? 'border-green-300 bg-green-50' : 'border-gray-300'} rounded-lg p-6 text-center`}>
        <input
          type="file"
          id="solution-file-upload"
          className="hidden"
          onChange={handleFileChange}
        />
        <label htmlFor="solution-file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center">
            {file ? (
              <>
                <FileText className="h-10 w-10 text-green-500 mb-2" />
                <p className="text-sm text-green-600 mb-1">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <FileIcon className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">גרור קובץ לכאן, או <span className="text-blue-600">לחץ לבחירה</span></p>
              </>
            )}
          </div>
        </label>
      </div>

      <div>
        <label className="text-sm font-medium flex items-center">
          <span className="text-red-500 ml-1">*</span>שם התלמיד
        </label>
        <Input
          placeholder="הזן את שם התלמיד"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          ביטול
        </Button>
        <Button
          onClick={handleUpload}
          disabled={isSubmitDisabled}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        >
          {isUploading ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              מעלה...
            </>
          ) : "העלאה"}
        </Button>
      </div>
    </div>
  );
};

export default UploadFile;