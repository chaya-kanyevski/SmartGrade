import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilePen, FileText, FileSpreadsheet, File as FileIcon } from "lucide-react";

type FileCategory = 'exam' | 'summary' | 'presentation' | 'lesson_plan' | 'quiz' | 'other';

interface FileDataItem {
  type: FileCategory;

}

interface FilesPerCategoryTableProps {
  data: FileDataItem[]; 
}

const fileTypeIcons: Record<FileCategory, JSX.Element> = {
  'exam': <FilePen className="h-4 w-4" />,
  'summary': <FileText className="h-4 w-4" />,
  'presentation': <FileSpreadsheet className="h-4 w-4" />,
  'lesson_plan': <FileSpreadsheet className="h-4 w-4" />,
  'quiz': <FilePen className="h-4 w-4" />,
  'other': <FileIcon className="h-4 w-4" />
};

const fileTypeColors: Record<FileCategory, string> = {
  'exam': 'bg-red-100 text-red-600',
  'summary': 'bg-blue-100 text-blue-600',
  'presentation': 'bg-amber-100 text-amber-600',
  'lesson_plan': 'bg-green-100 text-green-600',
  'quiz': 'bg-purple-100 text-purple-600',
  'other': 'bg-gray-100 text-gray-600'
};

const fileTypeNames: Record<FileCategory, string> = {
  'exam': 'מבחן',
  'summary': 'סיכום',
  'presentation': 'מצגת',
  'lesson_plan': 'מערך שיעור',
  'quiz': 'בוחן',
  'other': 'אחר'
};

const FilesPerCategoryTable = ({ data }: FilesPerCategoryTableProps) => { 
  const typeCounts: Record<string, number> = {}; 
  let totalCount = 0;

  data.forEach(item => { 
    if (!typeCounts[item.type]) { 
      typeCounts[item.type] = 0; 
    }
    typeCounts[item.type] += 1; //
    totalCount += 1;
  });

  interface TableDataItem {
    type: string;
    count: number;
    percentage: number;
  }

  const tableData: TableDataItem[] = Object.entries(typeCounts)
    .map(([type, count]) => ({ 
      type,
      count,
      percentage: (count / totalCount) * 100
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>סוג קובץ</TableHead>
          <TableHead className="text-left">כמות</TableHead>
          <TableHead className="text-left">אחוז</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map(({ type, count, percentage }) => (
          <TableRow key={type}>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-md ${fileTypeColors[type as FileCategory] || fileTypeColors.other}`}>
                  {fileTypeIcons[type as FileCategory] || fileTypeIcons.other}
                </div>
                <span>{fileTypeNames[type as FileCategory] || type}</span>
              </div>
            </TableCell>
            <TableCell className="text-left">{count}</TableCell>
            <TableCell className="text-left">
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span>{percentage.toFixed(1)}%</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FilesPerCategoryTable;