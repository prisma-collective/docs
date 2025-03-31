import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

const StandardButton: React.FC<ButtonProps> = ({ children, onClick, className }) => {
    return (
      <button
        onClick={onClick}
        className={`w-auto px-4 py-2 bg-white text-black rounded-md hover:bg-[#a250e0] transition duration-300 ease-in-out ${className}`}
      >
        {children}
      </button>
    );
  }

export default StandardButton;
