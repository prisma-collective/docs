type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
  };

export default function Button({ children, onClick }: ButtonProps) {
    return (
      <button
        onClick={onClick}
        className="rounded-full px-4 py-2 text-lg font-medium transition-colors 
                   bg-black text-white dark:bg-white dark:text-black 
                   hover:opacity-80"
      >
        {children}
      </button>
    );
  }
  