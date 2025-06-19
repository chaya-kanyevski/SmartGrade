import React from 'react';
import ConfirmDialog from '../ui/ConfirmDialog';

interface FileDeleteConfirmProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const FileDeleteConfirm: React.FC<FileDeleteConfirmProps> = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      message="האם אתה בטוח שברצונך למחוק את הקובץ?"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

export default FileDeleteConfirm;
