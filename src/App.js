import React, { useState, useEffect } from "react";
import Title from "../src/components/Title/Title";
import SaveButton from "../src/components/Button/Button";
import DraftEditor from "../src/components/Editor/Editor";
import { EditorState, RichUtils, convertFromRaw, convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import "./App.css";

const App = () => {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      handleEditorChange(newState);
      return "handled";
    }

    return "not-handled";
  };

  return (
    <div className="app">
      <div className="title-container">
        <Title />
        <SaveButton />
      </div>
      <div className="editor-container">
        <DraftEditor
          editorState={editorState}
          onEditorChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
        />
      </div>
    </div>
  );
};

export default App;
