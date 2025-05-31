import { useState, useContext, useCallback  } from 'react';
import {  Search,Plus, FileText, FilePen,
 // FilePresentation,
 Presentation, FileSpreadsheet, File as FileIcon, Folder, Grid3X3, List as ListIcon, Filter, SortDesc} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,  DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import { UserContext } from "../context/UserReducer";
import AddFile from "../components/files/addFile";
import { File } from '../models/File'; 
import FilesList from '@/components/files/filesList';

  type FileTabType = 'all' | File['type'];

const fileTypeIcons = {
  'exam': FilePen,
  'summary': FileText,
  'presentation': Presentation,
  'lesson_plan': FileSpreadsheet,
  'quiz': FilePen,
  'other': FileIcon
};

const formatDate = (date : Date) => {
  return new Date(date).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function Files() {
  const { user } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); 
  const [currentTab, setCurrentTab] = useState<FileTabType>('all');
  const [files, setFiles] = useState<File[]>([]);
  const [isAddFileDialogOpen, setIsAddFileDialogOpen] = useState(false); 

  const handleFilesLoaded = useCallback((loadedFiles: File[]) => {
    setFiles(loadedFiles);
  }, []);

  const handleFileAdded = (newFile: File) => {
    setFiles((prevFiles) => [newFile, ...prevFiles]);
    setIsAddFileDialogOpen(false);
  };

  return (
    <div className="fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">הקבצים שלי</h1>

        <Dialog open={isAddFileDialogOpen} onOpenChange={setIsAddFileDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90">
              <Plus className="ml-2 h-5 w-5" />
              העלאת קובץ חדש
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>העלאת קובץ חדש</DialogTitle>
              <DialogDescription>
                מלא את הפרטים והעלה את הקובץ שלך.
              </DialogDescription>
            </DialogHeader>
            <AddFile
              onFileAdded={(fileDto) => {
                const newFile: File = {
                  id: fileDto.id,
                  title: fileDto.title,
                  type: fileDto.type,
                  date: new Date(), 
                  size: 0.1,
                  tags: fileDto.tags,
                  filePath: fileDto.filePath,
                };
                handleFileAdded(newFile); 
              }}
              onClose={() => setIsAddFileDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pr-10"
            placeholder="חיפוש קבצים לפי שם או תגית..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <ListIcon className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="ml-2 h-4 w-4" />
                סינון
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCurrentTab('all')}>הכל</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentTab('exam')}>מבחנים בלבד</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentTab('summary')}>סיכומים בלבד</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentTab('presentation')}>מצגות בלבד</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentTab('lesson_plan')}>מערכי שיעור בלבד</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentTab('quiz')}>בחנים בלבד</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentTab('other')}>אחר</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as FileTabType)}>
        <TabsList>
          <TabsTrigger value="all">הכל</TabsTrigger>
          <TabsTrigger value="exam">מבחנים</TabsTrigger>
          <TabsTrigger value="summary">סיכומים</TabsTrigger>
          <TabsTrigger value="presentation">מצגות</TabsTrigger>
          <TabsTrigger value="lesson_plan">מערכי שיעור</TabsTrigger>
          <TabsTrigger value="quiz">בחנים</TabsTrigger>
          <TabsTrigger value="other">אחר</TabsTrigger>
        </TabsList>
      </Tabs>

      <FilesList
        searchQuery={searchQuery}
        viewMode={viewMode}
        currentTab={currentTab}
        onFilesLoaded={handleFilesLoaded} 
        files={files} 
      />
    </div>
  );
}