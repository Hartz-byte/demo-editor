import React from "react";
import "./Button.css";

const Button = () => {
  const handleSave = () => {
    // Add your save logic here if needed
    alert("Content saved!");
  };

  return (
    <button className="save-button" onClick={handleSave}>
      Save
    </button>
  );
};

export default Button;
