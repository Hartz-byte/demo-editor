import React from "react";
import { Editor, EditorState, RichUtils } from "draft-js";

const DraftEditor = ({ editorState, onEditorChange, handleKeyCommand }) => {
  // Function to determine the block type or inline style based on the starting text of a block
  const handleBlockConversion = (blockText) => {
    if (blockText.startsWith("# ") && blockText.length === 2) {
      return "header-one"; // Convert to H1 heading
    } else if (blockText.startsWith("* ") && blockText.length === 2) {
      return "REMOVE_STAR"; // Custom type to remove "* "
    }
    return null; // No conversion
  };

  // Function to handle changes in the editor content
  const handleEditorChange = (newEditorState) => {
    const contentState = newEditorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();

    blockMap.forEach((contentBlock, blockKey) => {
      const blockText = contentBlock.getText();
      const blockType = handleBlockConversion(blockText);

      if (blockType) {
        if (blockType === "REMOVE_STAR") {
          // Remove "* " from the text
          const newContentState = contentState.merge({
            blockMap: contentState.getBlockMap().set(
              blockKey,
              contentBlock.merge({
                type: "unstyled",
                text: blockText.substring(2), // Exclude the "* "
              })
            ),
          });

          // Push the updated content state to the editor state
          newEditorState = EditorState.push(
            newEditorState,
            newContentState,
            "change-block-type"
          );

          // Reset the selection to the end of the converted block
          newEditorState = EditorState.forceSelection(
            newEditorState,
            newEditorState.getSelection().merge({
              anchorOffset: blockText.length - 2,
              focusOffset: blockText.length - 2,
            })
          );

          // Apply BOLD style using RichUtils
          newEditorState = RichUtils.toggleInlineStyle(newEditorState, "BOLD");
        } else {
          // Update the block type and text for headers (H1) or other block types
          const newContentState = contentState.merge({
            blockMap: contentState.getBlockMap().set(
              blockKey,
              contentBlock.merge({
                type: blockType,
                text: blockText.substring(2), // Exclude the "# " or "* "
              })
            ),
          });

          // Push the updated content state to the editor state
          newEditorState = EditorState.push(
            newEditorState,
            newContentState,
            "change-block-type"
          );
        }
      }
    });

    // Call the callback function to update the parent component's state
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
