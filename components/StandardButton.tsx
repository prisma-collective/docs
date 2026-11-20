import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

const classesStandard = "relative px-5 py-2 text-black hover:text-white font-semibold rounded-2xl bg-white hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 transition duration-300 shadow-md hover:shadow-lg backdrop-blur-md";

const StandardButton: React.FC<ButtonProps> = ({ children, onClick, className }) => {
    return (
      <button
        onClick={onClick}
        className={`${classesStandard} ${className}`}
      >
        {children}
      </button>
    );
  }

export default StandardButton;
