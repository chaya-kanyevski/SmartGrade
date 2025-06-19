import React, { useState, useContext } from "react";
import { addFile, getPresignedUrl } from "../../services/fileService"; 
import {  FileType } from "../../models/File"; 
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, FileIcon } from 'lucide-react';
import { UserContext } from "@/context/UserReducer";
import { Textarea } from "@/components/ui/textarea"; 
import { SelectChangeEvent } from "@mui/material";
import FileTypeSelect from "./fileTypeSelect";
import { File as FileModel } from "../../models/File"; 
import LoadingButton from "@/components/ui/LoadingButton";
import Toast from "../ui/Toast";
import { useToast } from "@/context/ToastContext";

interface AddFileProps {
  onFileAdded: (newFile: FileModel) => void; 
  onClose: () => void; 
}

const AddFile: React.FC<AddFileProps> = ({ onFileAdded, onClose }) => {
  const { user } = useContext(UserContext);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    file: null as File | null,
    tags: "",
    description: "",
    type: "other" as FileType,
  });
  

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const selectedFile = e.target.files?.[0] || null;
      setFormData((prevData) => ({
        ...prevData,
        file: selectedFile,
        title: selectedFile ? selectedFile.name.split('.').slice(0, -1).join('.') : "",
        size: selectedFile ? selectedFile.size : 0,
      }));
    } else {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name as keyof typeof prevData]: value, 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.id) {
      setError("שגיאה: משתמש לא מחובר.");
      return;
    }
    if (!formData.title || !formData.file) {
      setError("יש למלא כותרת ולבחור קובץ.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const presignedUrl = await getPresignedUrl(formData.file.name);
      await axios.put(presignedUrl, formData.file, {
        headers: { "Content-Type": formData.file.type },
      });
      const fileAccessUrl = presignedUrl.split("?")[0];
    console.log("Form data title before submit:", formData.title);
    console.log("Form data file name before submit:", formData.file?.name);
    const addFileResponse = await addFile(
        user.id,
        formData.title,
        fileAccessUrl,
        formData.tags,
        formData.description,
        formData.type, 
        formData.file.size, 
      );

      if (addFileResponse.data && addFileResponse.data.id) {
        const newFile: FileModel = {
          id: addFileResponse.data.id,
          title: formData.title,
          filePath: fileAccessUrl,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
          description: formData.description,
          type: formData.type,
          size:  formData.file.size,
        };
        console.log("New file added:", newFile);
        onFileAdded(newFile);
        showToast("הקובץ נוסף בהצלחה!", "success");
        onClose();
      } else {
        setError("שגיאה בהוספת הקובץ: " + (addFileResponse.data?.title || "תגובה לא תקינה מהשרת."));
      }
    } catch (err: any) {
      console.error("שגיאה בהעלאת הקובץ או בהוספתו:", err);
      setError("❌ שגיאה בהעלאה: " + (err instanceof Error ? err.message : "נסה שוב."));
    } finally {
      setIsUploading(false);

setFormData({ 
  title: "", 
  file: null, 
  tags: "", 
  description: "",
  type: "other", 
});    }
  };

const handleTypeChange = (newType: FileType) => {
  setFormData((prevData) => ({
    ...prevData,
    type: newType,
  }));
};

  const isSubmitDisabled = !formData.title || !formData.file || isUploading;

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <div className={`border-2 border-dashed ${formData.file ? 'border-green-300 bg-green-50' : 'border-gray-300'} rounded-lg p-6 text-center`}>
        <input
          type="file"
          id="file-upload-add-file"
          className="hidden"
          name="file"
          onChange={handleChange}
          accept=".pdf,.doc,.docx,.ppt,.pptx"
        />
        <label htmlFor="file-upload-add-file" className="cursor-pointer">
          <div className="flex flex-col items-center">
            {formData.file ? (
              <>
                <FileText className="h-10 w-10 text-green-500 mb-2" />
                <p className="text-sm text-green-600 mb-1">{formData.file.name}</p>
                <p className="text-xs text-gray-500">
                  {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
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
          <span className="text-red-500 ml-1">*</span>כותרת
        </label>
        <Input
          placeholder="הזן כותרת לקובץ (ממולא אוטומטית)"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">תגיות (מופרדות בפסיקים, אופציונלי)</label>
        <Input
          placeholder="לדוגמה: מתמטיקה, כיתה ט, גיאומטריה"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="placeholder-gray-400"
        />
      </div>

      <div>
        <label className="text-sm font-medium">תיאור (אופציונלי)</label>
        <Textarea 
          placeholder="הזן תיאור קצר או מפורט על הקובץ"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="placeholder-gray-400"
        />
      </div>    
    <FileTypeSelect
  value={formData.type}
  onChange={handleTypeChange}
/>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          ביטול
        </Button>
        <LoadingButton
  type="submit"
  isLoading={isUploading}
  disabled={isSubmitDisabled}
>
  העלאה
</LoadingButton>
      </div>
    </form>
    </>
  )
};

export default AddFile;