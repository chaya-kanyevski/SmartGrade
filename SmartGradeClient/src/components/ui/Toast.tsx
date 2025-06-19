import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // הצג
    setVisible(true);

    // התחל להיעלם אחרי 3 שניות
    const hideTimer = setTimeout(() => setVisible(false), 3000);

    // הסר מה-DOM אחרי 3.5 שניות
    const removeTimer = setTimeout(onClose, 3500);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  // צבע רקע לפי סוג ההודעה
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  // אייקון מתאים
  const icon =
    type === 'success' ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className={`${bgColor} text-white px-6 py-3 text-md rounded shadow-lg w-64 flex items-center gap-3 pointer-events-auto transition-opacity duration-500 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {icon}
        <span className="leading-none text-center">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
