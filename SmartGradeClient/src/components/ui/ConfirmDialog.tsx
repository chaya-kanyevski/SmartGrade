// ConfirmDialog.tsx
import React from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-right">
        <p className="mb-6 text-gray-800">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            ביטול
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            מחיקה
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
