import React from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  SelectionState,
} from "draft-js";
import "./Editor.css";

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
  const handleBlockConversion = (blockText) => {
    if (blockText.startsWith("# ") && blockText.length === 2) {
      return "header-one";
    } else if (blockText.startsWith("* ") && blockText.length === 2) {
      return "BOLD";
    } else if (blockText.startsWith("** ") && blockText.length === 3) {
      return "RED_COLOR";
    } else if (blockText.startsWith("*** ") && blockText.length === 4) {
      return "UNDERLINE_STYLE";
    }
    return null;
  };

  const handleEditorChange = (newEditorState) => {
    let updatedEditorState = newEditorState;
    const contentState = updatedEditorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();

    blockMap.forEach((contentBlock, blockKey) => {
      const blockText = contentBlock.getText();
      const blockType = handleBlockConversion(blockText);

      if (blockType) {
        if (blockType === "header-one") {
          // Update block type and text for header-one
          const newContentState = contentState.merge({
            blockMap: contentState.getBlockMap().set(
              blockKey,
              contentBlock.merge({
                type: blockType,
                text: blockText.substring(2),
              })
            ),
          });

          // Push updated content state
          updatedEditorState = EditorState.push(
            updatedEditorState,
            newContentState,
            "change-block-type"
          );
        } else if (blockType === "BOLD") {
          // Remove "* " from the text for BOLD
          const newContentState = Modifier.replaceText(
            contentState,
            new SelectionState({
              anchorKey: blockKey,
              anchorOffset: 0,
              focusKey: blockKey,
              focusOffset: blockText.length,
            }),
            blockText.substring(2)
          );

          // Update block type for BOLD
          updatedEditorState = EditorState.push(
            updatedEditorState,
            newContentState.merge({
              blockMap: newContentState.getBlockMap().set(
                blockKey,
                contentBlock.merge({
                  type: "unstyled",
                  text: blockText.substring(2),
                })
              ),
            }),
            "change-block-type"
          );

          // Reset the selection for BOLD
          updatedEditorState = EditorState.forceSelection(
            updatedEditorState,
            updatedEditorState.getSelection().merge({
              anchorOffset: blockText.length - 2,
              focusOffset: blockText.length - 2,
            })
          );

          // Apply BOLD style
          updatedEditorState = RichUtils.toggleInlineStyle(
            updatedEditorState,
            "BOLD"
          );
        } else if (
          blockType === "RED_COLOR" ||
          blockType === "UNDERLINE_STYLE"
        ) {
          // Remove the markers from the text for RED_COLOR or UNDERLINE_STYLE
          const newContentState = Modifier.replaceText(
            contentState,
            new SelectionState({
              anchorKey: blockKey,
              anchorOffset: 0,
              focusKey: blockKey,
              focusOffset: blockText.length,
            }),
            blockText.substring(3)
          );

          // Update block type for RED_COLOR or UNDERLINE_STYLE
          updatedEditorState = EditorState.push(
            updatedEditorState,
            newContentState.merge({
              blockMap: newContentState.getBlockMap().set(
                blockKey,
                contentBlock.merge({
                  type: "unstyled",
                  text: blockText.substring(3),
                })
              ),
            }),
            "change-block-type"
          );

          // Reset the selection for RED_COLOR or UNDERLINE_STYLE
          updatedEditorState = EditorState.forceSelection(
            updatedEditorState,
            updatedEditorState.getSelection().merge({
              anchorOffset: blockText.length - 3,
              focusOffset: blockText.length - 3,
            })
          );

          // Apply custom styles for RED_COLOR or UNDERLINE_STYLE
          updatedEditorState = RichUtils.toggleInlineStyle(
            updatedEditorState,
            blockType
          );
        }
      }
    });

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
