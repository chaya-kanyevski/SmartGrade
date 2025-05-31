import React from "react";
import { FileType, fileTypeOptions } from "@/models/File";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FileTypeSelectProps {
  value: FileType;
  onChange: (value: FileType) => void;
  error?: boolean;
  helperText?: string;
}

const FileTypeSelect: React.FC<FileTypeSelectProps> = ({ value, onChange, error, helperText }) => {
  return (
    <div className="mb-4 text-right">
        <label className="text-sm font-medium">סוג קובץ</label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="fileType" className={`w-full h-10 rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} px-4`}>
          <SelectValue placeholder="בחר סוג קובץ" />
        </SelectTrigger>
        <SelectContent dir="rtl" className="text-right">
          {fileTypeOptions.map((option) => (
            <SelectItem className="text-right" key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helperText && <p className="text-red-500 text-sm mt-1">{helperText}</p>}
    </div>
  );
};

export default FileTypeSelect;
