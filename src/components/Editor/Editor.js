import React from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import "./Editor.css";

// custom styles
const styleMap = {
  BOLD: {
    fontWeight: "bold",
  },
  RED_COLOR: {
    color: "red",
  },
  UNDERLINE_STYLE: {
    textDecoration: "underline",
  },
};

const DraftEditor = ({ editorState, onEditorChange, handleKeyCommand }) => {
  // Function to determine the block type or inline style based on the starting text of a block
  const handleBlockConversion = (blockText) => {
    if (blockText.startsWith("# ") && blockText.length === 2) {
      return "header-one"; // Convert to H1 heading
    } else if (blockText.startsWith("* ") && blockText.length === 2) {
      return "BOLD"; // Custom type to remove "* "
    } else if (blockText.startsWith("** ") && blockText.length === 3) {
      return "RED_COLOR"; // Custom type to change text color to red for "** "
    } else if (blockText.startsWith("*** ") && blockText.length === 4) {
      return "UNDERLINE_STYLE"; // Custom type for underline styling for "*** "
    }
    return null; // No conversion
  };

  // Function to handle changes in the editor content
  const handleEditorChange = (newEditorState) => {
    const contentState = newEditorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();
    let updatedEditorState = newEditorState;

    blockMap.forEach((contentBlock, blockKey) => {
      const blockText = contentBlock.getText();
      const blockType = handleBlockConversion(blockText);

      if (blockType) {
        if (blockType === "BOLD") {
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
          updatedEditorState = EditorState.push(
            updatedEditorState,
            newContentState,
            "change-block-type"
          );

          // Reset the selection to the end of the converted block
          updatedEditorState = EditorState.forceSelection(
            updatedEditorState,
            updatedEditorState.getSelection().merge({
              anchorOffset: blockText.length - 2,
              focusOffset: blockText.length - 2,
            })
          );

          // Apply BOLD style using RichUtils
          updatedEditorState = RichUtils.toggleInlineStyle(
            updatedEditorState,
            "BOLD"
          );
        } else if (blockType === "header-one") {
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
          updatedEditorState = EditorState.push(
            updatedEditorState,
            newContentState,
            "change-block-type"
          );
        } else if (
          blockType === "RED_COLOR" ||
          blockType === "UNDERLINE_STYLE"
        ) {
          // Apply custom styles using inline style
          const selection = contentState.getSelectionAfter();
          updatedEditorState = RichUtils.toggleInlineStyle(
            updatedEditorState,
            blockType,
            selection
          );
        }
      }
    });

    // Call the callback function to update the parent component's state
    onEditorChange(updatedEditorState);
  };

  return (
    <Editor
      editorState={editorState}
      onChange={handleEditorChange}
      handleKeyCommand={handleKeyCommand}
      placeholder="Start typing..."
      customStyleMap={styleMap}
      className="editor"
    />
  );
};

export default DraftEditor;
