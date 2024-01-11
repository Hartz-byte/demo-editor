import React from "react";
import "./Button.css";

const Button = ({ onClick, label }) => {
  return (
    <div>
      <button onClick={onClick}>{label}</button>
    </div>
  );
};

export default Button;
