import React from "react";
import { convertToRaw } from "draft-js";

const Button = ({ editorState, onSave }) => {
  const handleSave = () => {
    // retrieve contentState from the current editorState
    const contentState = editorState.getCurrentContent();

    // convert contentState to RawDraftContentState
    const contentString = JSON.stringify(convertToRaw(contentState));

    // save the content to local storage
    localStorage.setItem("editorContent", contentString);

    if (onSave) {
      onSave();
    }

    // save alert
    alert("Content saved!");
  };

  return (
    <button className="save-button" onClick={handleSave}>
      Save
    </button>
  );
};

export default Button;
