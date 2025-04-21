import React from "react";

type InputProps = {
  children: React.ReactNode;
  className?: string;
};

const StandardButton: React.FC<InputProps> = ({ children, className }) => {
    return (
      <input
        className={`${className}`}
      >
        {children}
      </input>
    );
  }

export default StandardButton;
