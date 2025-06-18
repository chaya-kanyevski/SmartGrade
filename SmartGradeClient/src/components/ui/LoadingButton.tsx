interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  children: React.ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  disabled,
  className,
  ...rest
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`relative flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-50 ${className}`}
      {...rest}
    >
      {isLoading && (
        <span className="absolute">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        </span>
      )}
      <span className={isLoading ? "opacity-0" : ""}>{children}</span>
    </button>
  );
};

export default LoadingButton;
