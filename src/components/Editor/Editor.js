import React from 'react';
import { Editor } from 'draft-js';
import './Editor.css';

const DraftEditor = ({ editorState, onEditorChange, handleKeyCommand }) => {
  return (
    <Editor
      editorState={editorState}
      onChange={onEditorChange}
      handleKeyCommand={handleKeyCommand}
      placeholder="Start typing..."
      className="editor"
    />
  );
};

export default DraftEditor;
