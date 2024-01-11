import React, { useState } from "react";
import "./Editor.css";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";

const MyEditor = ({ onSave }) => {
  const [editorState, setEditorState] = useState(() => {
    // load from local storage
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
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

  const onTab = (e) => {
    const maxDepth = 4; // Set the maximum indentation level
    handleEditorChange(RichUtils.onTab(e, editorState, maxDepth));
  };

  const toggleBlockType = (blockType) => {
    handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const handleSaveClick = () => {
    // Save content to local storage
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(rawContent));
    onSave();
    alert('Saved!');
  };

  return (
    <div>
      <div>
        <button onClick={() => toggleBlockType("header-one")}>H1</button>
        <button onClick={() => toggleBlockType("BOLD")}>Bold</button>
        <button onClick={() => toggleBlockType("ITALIC")}>Italic</button>
        <button onClick={() => toggleBlockType("UNDERLINE")}>Underline</button>
      </div>
      <div>
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
          onTab={onTab}
        />
      </div>
      <div>
        <button onClick={handleSaveClick}>Save</button>
      </div>
    </div>
  );
};

export default MyEditor;
