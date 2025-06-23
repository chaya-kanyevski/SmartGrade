import React from 'react';
import { File } from '../../models/File';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, FilePen, Presentation, FileSpreadsheet, File as FileIcon } from 'lucide-react';
import FileActionsMenu from './fileActionsMenu';
import FileTagList from './FileTagList';

interface FileGridViewProps {
  files: File[];
  onDeleteFile: (fileId: number) => void;
  onClickOnFile: (file: File) => void;
  truncateTitle: (title: string, maxLength: number) => string
}
export const fileTypeIcons = {
  'exam': FilePen,
  'summary': FileText,
  'presentation': Presentation,
  'lesson_plan': FileSpreadsheet,
  'quiz': FilePen,
  'other': FileIcon
};
export const fileTypeColors: Record<string, string> = {
  'exam': 'bg-purple-100 text-purple-600',
  'summary': 'bg-green-100 text-green-600',
  'presentation': 'bg-pink-100 text-pink-600',
  'lesson_plan': 'bg-yellow-100 text-yellow-600',
  'quiz': 'bg-indigo-100 text-indigo-600',
  'other': 'bg-gray-100 text-gray-600'
};
const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleString('he-IL', {
    timeZone: 'Asia/Jerusalem', // מבטיח שעה מקומית נכונה!
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(' בשעה ', ', ');
};


const FileGridView: React.FC<FileGridViewProps> = ({ files, onDeleteFile, onClickOnFile, truncateTitle }) => {
  const handleDownload = async (file: File) => {
    if (!file.filePath) {
      console.error("Missing file URL");
      return;
    }

    try {
      const response = await fetch(file.filePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.title || "downloaded_file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // const handleOpenFileInNewTab = (file: File) => {
  //   if (!file.filePath ) {
  //     console.log(file)
  //     console.error("Missing file URL");
  //     return;
  //   }
  //   const link = document.createElement("a");
  //   link.href = file.filePath;
  //   link.download = file.title;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const sortedFiles = [...files].sort((a, b) => {
    // files.forEach(file => console.log(`ccccc${file.createdAt}`));
    // files.forEach(file => console.log(file.date));

    return new Date(b.date!).getTime() - new Date(a.date!).getTime();

  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {sortedFiles.map(file => {
        const FileTypeIcon = fileTypeIcons[file.type!] || FileIcon;
        const colorClasses = fileTypeColors[file.type!] || 'bg-gray-100 text-gray-600';
        return (
<div onClick={() => onClickOnFile(file)} className="cursor-pointer">
          <Card key={file.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="p-4 flex flex-col gap-1">
                <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${colorClasses}`}>
                    <FileTypeIcon className="h-6 w-6" />
                  </div>
                  <FileActionsMenu
                    onDownload={() => handleDownload(file)}
                    onDelete={() => {
                        onDeleteFile(file.id);
                    }}
                  />
                </div>
                <h3 className="font-medium text-gray-900">{truncateTitle(file.title, 30)}</h3>
                גודל: {(file.size ? file.size / (1024 * 1024) : 0).toFixed(1)} MB
                <p className="text-sm text-gray-500">{formatDate(file.date!)}</p>
                {/* <p className="text-sm text-gray-500">{file.createdAt!}</p> */}

                <FileTagList tags={file.tags} />
              </div>
            </CardContent>
          </Card>
          </div>
        );
      })}
    </div>
  );
};
export default FileGridView;