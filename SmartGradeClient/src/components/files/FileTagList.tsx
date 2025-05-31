import React from 'react';

interface FileTagListProps {
  tags: string[];
}

const FileTagList: React.FC<FileTagListProps> = ({ tags }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default FileTagList;
