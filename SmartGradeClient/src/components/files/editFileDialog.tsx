import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { updateFile } from "@/services/fileService";
import LoadingButton from "@/components/ui/LoadingButton";
import { FileType, File as UserFile } from "@/models/File";
import FileTypeSelect from "./fileTypeSelect";

interface EditFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    id: number;
    userId: number;
    title: string;
    tags: string;
    description: string;
    filePath: string;
    type?: FileType;
  };
  onSaveSuccess?: (updatedFile: UserFile) => void;
}

export default function EditFileDialog({ isOpen, onClose, file, onSaveSuccess }: EditFileDialogProps) {
  const [formData, setFormData] = useState({
    title: file.title,
    tags: file.tags,
    description: file.description,
    type: file.type || "other" as FileType,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (newType: FileType) => {
    setFormData(prev => ({ ...prev, type: newType }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await updateFile(file.id, file.userId, formData.title, formData.tags, formData.description, file.filePath, file.type || "other");
      onSaveSuccess?.({
        ...file,
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()) 
      });
      
      onClose();
    } catch (err: any) {
        console.error("שגיאה בשמירה", err);
        if (err.response) {
          console.error("Response data:", err.response.data);
        }
        if (err.response?.data?.errors) {
            console.error("Validation errors:", err.response.data.errors);
          }
          
        setError("שגיאה בשמירה, נסה שוב");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
<DialogContent className="text-right max-w-md w-full mx-auto p-6">
<DialogHeader>
          <DialogTitle className="text-right">עריכת קובץ</DialogTitle>
        </DialogHeader>

        <form
  onSubmit={(e) => { e.preventDefault(); handleSave(); }}
  className="space-y-4 max-w-sm mx-auto"
>
  {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

  <div>
    <label className="text-sm font-medium flex items-center">
      <span className="text-red-500 ml-1">*</span>כותרת
    </label>
    <Input
      name="title"
      value={formData.title}
      onChange={handleChange}
      placeholder="כותרת הקובץ"
      required
    />
  </div>

  <div>
    <label className="text-sm font-medium">תגיות (מופרדות בפסיקים, אופציונלי)</label>
    <Input
      name="tags"
      value={formData.tags}
      onChange={handleChange}
      placeholder="תגיות"
      className="placeholder-gray-400"
    />
  </div>

  <div>
    <label className="text-sm font-medium">תיאור (אופציונלי)</label>
    <Textarea
      name="description"
      value={formData.description}
      onChange={handleChange}
      placeholder="תיאור"
      className="placeholder-gray-400"
      rows={3}
    />
  </div>

  <FileTypeSelect value={formData.type} onChange={handleTypeChange} />

  <p className="text-sm text-gray-500 truncate">{file.filePath}</p>

  <div className="flex justify-end gap-2">
    <Button variant="outline" onClick={onClose}>ביטול</Button>
    <LoadingButton type="submit" isLoading={isSaving} disabled={isSaving}>שמור</LoadingButton>
  </div>
</form>

      </DialogContent>
    </Dialog>
  );
}
