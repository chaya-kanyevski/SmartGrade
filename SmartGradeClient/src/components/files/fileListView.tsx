import React from 'react';
import { File } from '../../models/File';
import { FileText, FilePen, Presentation, FileSpreadsheet, File as FileIcon } from 'lucide-react';
import { fileTypeColors, fileTypeIcons } from './fileGridView';

interface FileListViewProps {
  files: File[];
  onDeleteFile: (fileId: number) => void;
  onClickOnFile: (file: File) => void;
  truncateTitle: (title: string, maxLength: number) => string
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const FileListView: React.FC<FileListViewProps> = ({ files, onDeleteFile, onClickOnFile, truncateTitle }) => {
  return (
    <div className="border rounded-md">
<div className="hidden md:grid grid-cols-12 py-2 px-4 bg-gray-50 font-medium text-gray-600 border-b">
<div className="col-span-6"></div>
  <div className="col-span-1">סוג</div>
  <div className="col-span-2">גודל</div>
  <div className="col-span-2">תאריך</div>
  <div className="col-span-1 text-red-500"></div>
</div>

      {files.map(file => {
        const FileTypeIcon = fileTypeIcons[file.type!] || FileIcon;
        const colorClasses = fileTypeColors[file.type!] || 'bg-gray-100 text-gray-600';

        return (
          <div onClick={() => onClickOnFile(file)} className="cursor-pointer">
          <div
          key={file.id}
          className="grid grid-cols-1 md:grid-cols-12 py-3 px-4 border-b last:border-0 hover:bg-gray-50 items-center cursor-pointer gap-y-2"
          >
          <div className="col-span-6 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorClasses}`}>
              <FileTypeIcon className="h-5 w-5" />
            </div>
            <span>{truncateTitle(file.title, 40)}</span>
          </div>
          <div className="col-span-1 text-gray-700 capitalize">{file.type}</div>
          <div className="col-span-2 text-gray-700">
            {(file.size ? file.size / (1024 * 1024) : 0).toFixed(1)} MB
          </div>
          <div className="col-span-2 text-gray-700">{formatDate(file.date!)}</div>
          <div className="col-span-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                  onDeleteFile(file.id);

              }}
              className="text-red-500 hover:text-red-700"
              aria-label={`מחק קובץ ${file.title}`}
            >
              מחק
            </button>
          </div>
        </div>
        </div>

        );
      })}
    </div>
  );
};

export default FileListView;
