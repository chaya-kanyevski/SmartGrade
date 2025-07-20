import React from 'react';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

interface FileActionsMenuProps {
  onDownload: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const FileActionsMenu: React.FC<FileActionsMenuProps> = ({ onDownload, onDelete, onEdit }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="אפשרויות" className="p-1 rounded hover:bg-gray-200">
          <MoreVertical size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onDownload}>הורד</DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>ערוך</DropdownMenuItem>
        <DropdownMenuItem>נתח עם AI</DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600">מחק</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FileActionsMenu;
