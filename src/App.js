import React, { useState, useEffect } from "react";
import Title from "../src/components/Title/Title";
import Button from "../src/components/Button/Button";
import DraftEditor from "../src/components/Editor/Editor";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import "./App.css";

const App = () => {
  // state to manage the editor's content
  const [editorState, setEditorState] = useState(() => {
    // retrieve saved content from localStorage if available
    const savedContent = localStorage.getItem("editorContent");

    if (savedContent) {
      try {
        // parse the JSON string and convert to EditorState
        const contentState = convertFromRaw(JSON.parse(savedContent));
        return EditorState.createWithContent(contentState);
      } catch (error) {
        console.error("Error parsing saved content:", error);
        return EditorState.createEmpty();
      }
    } else {
      return EditorState.createEmpty();
    }
  });

  // function to handle changes in the editor content
  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  // function to handle save logic
  const handleSave = () => {
    console.log("Additional save logic...");
  };

  return (
    <div className="app">
      <div className="title-container">
        {/* title component */}
        <Title />
        {/* save button component */}
        <Button editorState={editorState} onSave={handleSave} />
      </div>
      <div className="editor-container">
        {/* draftEditor component */}
        <DraftEditor
          editorState={editorState}
          onEditorChange={handleEditorChange}
        />
      </div>
    </div>
  );
};

export default App;
