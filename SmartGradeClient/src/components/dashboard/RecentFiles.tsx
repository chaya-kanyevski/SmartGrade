import { Button } from "@/components/ui/button";
import { Download, File as FileIcon } from "lucide-react";
import { File } from "@/models/File";
import { fileTypeColors, fileTypeIcons } from "../files/fileGridView";

interface RecentFilesProps {
  files: File[];
}

const RecentFiles: React.FC<RecentFilesProps> = ({ files }) => {
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
  return (
    <div className="space-y-4">
      {files.map((file) => {
        const FileTypeIcon = fileTypeIcons[file.type!] || FileIcon;
        const colorClasses = fileTypeColors[file.type!] || 'bg-gray-100 text-gray-600';

        return (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses}`}>
                <FileTypeIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{file.title}</p>
                <p className="text-sm text-gray-500">
                  {new Date(file.date!).toLocaleDateString("he-IL")}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() =>handleDownload(file)}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentFiles;
