import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/UserReducer';
import { fetchFilesByUser, deleteFile } from '../../services/fileService';
import { File } from '../../models/File';
import FileGridView from './fileGridView';
import FileListView from './fileListView';
import { useToast } from '@/context/ToastContext';
import FileDeleteConfirm from './FileDeleteConfirm';

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
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [fileIdToDelete, setFileIdToDelete] = useState<number | null>(null);

  useEffect(() => {
    const loadUserFiles = async () => {
      setIsLoading(true);
      setError('');
      if (!user?.id) {
        setError('משתמש לא מחובר.');
        setIsLoading(false);
        return;
      }
      try {
        const filesDataDto = await fetchFilesByUser(user.id);
        const loadedFiles: File[] = filesDataDto.map(dto => ({
          id: dto.id,
          title: dto.title,
          type: dto.type ?? 'other',
          date: new Date(),
          size: dto.size ?? 0,
          tags: typeof dto.tags === 'string' ? dto.tags.split(',').map(t => t.trim()) : [],
          filePath: dto.filePath,
          description: dto.description ?? '',
        }));
        onFilesLoaded(loadedFiles);
      } catch {
        setError('שגיאה בטעינת הקבצים.');
      } finally {
        setIsLoading(false);
      }
    };
    loadUserFiles();
  }, [user?.id, onFilesLoaded]);

  const filteredFiles = files.filter(file => {
    const matchesSearch =
      file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return currentTab === 'all' ? matchesSearch : file.type === currentTab && matchesSearch;
  });

  const handleAskDelete = (fileId: number) => {
    setFileIdToDelete(fileId);
    setIsConfirmOpen(true);
  };

  const handleDeleteFile = async () => {
    if (fileIdToDelete === null) return;

    try {
      const success = await deleteFile(fileIdToDelete);
      if (success) {
        const updatedFiles = files.filter(f => f.id !== fileIdToDelete);
        onFilesLoaded(updatedFiles);
        showToast('הקובץ נמחק בהצלחה!', 'success');
      }
    } catch {
      showToast('אירעה שגיאה בעת מחיקת הקובץ.', 'error');
    } finally {
      setIsConfirmOpen(false);
      setFileIdToDelete(null);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return <div className="text-center p-12 text-red-500">{error}</div>;

  if (filteredFiles.length === 0) return (
    <div className="text-center p-12">
      <h3 className="mt-4 text-xl font-semibold text-gray-800">
        לא מצאנו קבצים בשבילך עדיין
      </h3>
      <p className="mt-2 text-gray-600">
        זה הזמן להתחיל להעלות קבצים, לארגן את החומר שלך ולעבוד בצורה חכמה יותר 🎉
      </p>
    </div>
  );

  return (
    <>
      {viewMode === 'grid' ? (
        <FileGridView files={filteredFiles} onDeleteFile={handleAskDelete} />
      ) : (
        <FileListView files={filteredFiles} onDeleteFile={handleAskDelete} />
      )}
      <FileDeleteConfirm
        isOpen={isConfirmOpen}
        onConfirm={handleDeleteFile}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  );
};
export default FilesList;