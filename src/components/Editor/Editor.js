import React from "react";
import { Editor, EditorState } from "draft-js";

const DraftEditor = ({ editorState, onEditorChange, handleKeyCommand }) => {
  const handleBlockConversion = (blockText) => {
    if (blockText.startsWith("# ") && blockText.length === 2) {
      return "header-one";
    }
    return null;
  };

  const handleEditorChange = (newEditorState) => {
    const contentState = newEditorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();

    blockMap.forEach((contentBlock, blockKey) => {
      const blockText = contentBlock.getText();
      const blockType = handleBlockConversion(blockText);

      if (blockType) {
        const newContentState = contentState.merge({
          blockMap: contentState.getBlockMap().set(
            blockKey,
            contentBlock.merge({
              type: blockType,
              text: blockText.substring(2), // Exclude the "# "
            })
          ),
        });

        newEditorState = EditorState.push(
          newEditorState,
          newContentState,
          "change-block-type"
        );
      }
    });

    onEditorChange(newEditorState);
  };

  return (
    <Editor
      editorState={editorState}
      onChange={handleEditorChange}
      handleKeyCommand={handleKeyCommand}
      placeholder="Start typing..."
      className="editor"
    />
  );
};

export default DraftEditor;
