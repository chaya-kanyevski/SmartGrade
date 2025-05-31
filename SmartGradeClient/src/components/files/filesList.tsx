import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/UserReducer';
import { fetchFilesByUser, deleteFile } from '../../services/fileService';
import { File } from '../../models/File';
import FileGridView from './fileGridView';
import FileListView from './fileListView';

type FileTabType = 'all' | File['type'];

interface FilesListProps {
  searchQuery: string;
  viewMode: 'grid' | 'list';
  currentTab: FileTabType;
  onFilesLoaded: (files: File[]) => void;
  files: File[];
}

const FilesList: React.FC<FilesListProps> = ({ searchQuery, viewMode, currentTab, onFilesLoaded, files }) => {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadUserFiles = async () => {
      setIsLoading(true);
      setError('');
      try {
        if (!user?.id) {
          setError("משתמש לא מחובר.");
          setIsLoading(false);
          return;
        }
        const filesDataDto = await fetchFilesByUser(user.id);

        const loadedFiles: File[] = filesDataDto.map(dto => ({
          id: dto.id,
          title: dto.title,
          type: dto.type ?? 'other',
          date: new Date(),
          size: dto.size ?? 0,
          tags: typeof dto.tags === 'string'
            ? dto.tags.split(',').map((tag: string) => tag.trim())
            : [],
          filePath: dto.filePath,
          description: dto.description ?? '',
        }));

        onFilesLoaded(loadedFiles);
      } catch (err) {
        console.error(err);
        setError("שגיאה בטעינת הקבצים.");
      } finally {
        setIsLoading(false);
      }
    };
    loadUserFiles();
  }, [user?.id, onFilesLoaded]);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (currentTab === 'all') return matchesSearch;
    return file.type === currentTab && matchesSearch;
  });

  const handleDeleteFile = async (fileId: number) => {
    try {
      const success = await deleteFile(fileId);
      if (success) {
        const updatedFiles = files.filter(file => file.id !== fileId);
        onFilesLoaded(updatedFiles);
      }
    } catch {
      alert("אירעה שגיאה בעת מחיקת הקובץ.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-12 text-red-500">{error}</div>;
  }

  if (filteredFiles.length === 0) {
    return (
      <div className="text-center p-12">
        <h3 className="mt-4 text-lg font-medium">אין קבצים</h3>
        <p className="text-gray-500">לא נמצאו קבצים מתאימים לחיפוש שלך</p>
      </div>
    );
  }

  return (
    <>
      {viewMode === 'grid' ? (
        <FileGridView files={filteredFiles} onDeleteFile={handleDeleteFile} />
      ) : (
        <FileListView files={filteredFiles} onDeleteFile={handleDeleteFile} />
      )}
    </>
  );
};

export default FilesList;