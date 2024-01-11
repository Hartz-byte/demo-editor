import React from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  SelectionState,
} from "draft-js";

// custom styles for inline formatting
const styleMap = {
  BOLD: { fontWeight: "bold" },
  RED_COLOR: { color: "red" },
  UNDERLINE_STYLE: { textDecoration: "underline" },
};

const DraftEditor = ({ editorState, onEditorChange, handleKeyCommand }) => {
  // function to determine the block type or inline style based on the starting text of a block
  const handleBlockConversion = (blockText) => {
    if (blockText.startsWith("# ") && blockText.length === 2)
      return "header-one";
    if (blockText.startsWith("* ") && blockText.length === 2)
      return "BOLD";
    if (blockText.startsWith("** ") && blockText.length === 3)
      return "RED_COLOR";
    if (blockText.startsWith("*** ") && blockText.length === 4)
      return "UNDERLINE_STYLE";
    return null;
  };

  // function to handle changes in the editor content
  const handleEditorChange = (newEditorState) => {
    let updatedEditorState = newEditorState;
    const contentState = updatedEditorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();

    blockMap.forEach((contentBlock, blockKey) => {
      const blockText = contentBlock.getText();
      const blockType = handleBlockConversion(blockText);

      if (blockType) {
        // handle header-one (h1)
        if (blockType === "header-one") {
          const newContentState = contentState.merge({
            blockMap: contentState.getBlockMap().set(
              blockKey,
              contentBlock.merge({
                type: blockType,
                text: blockText.substring(2),
              })
            ),
          });
          // update block type
          updatedEditorState = EditorState.push(
            updatedEditorState,
            newContentState,
            "change-block-type"
          );
        }

        // handle BOLD, RED_COLOR, and UNDERLINE_STYLE
        else if (
          blockType === "BOLD" ||
          blockType === "RED_COLOR" ||
          blockType === "UNDERLINE_STYLE"
        ) {
          // determine the length of markers for BOLD or other styles
          const markerLength = blockType === "BOLD" ? 2 : 3;

          // remove the markers from the text
          const newContentState = Modifier.replaceText(
            contentState,
            new SelectionState({
              anchorKey: blockKey,
              anchorOffset: 0,
              focusKey: blockKey,
              focusOffset: blockText.length,
            }),
            blockText.substring(markerLength)
          );

          // update block type
          updatedEditorState = EditorState.push(
            updatedEditorState,
            newContentState.merge({
              blockMap: newContentState.getBlockMap().set(
                blockKey,
                contentBlock.merge({
                  type: "unstyled",
                  text: blockText.substring(markerLength),
                })
              ),
            }),
            "change-block-type"
          );

          // reset the selection
          updatedEditorState = EditorState.forceSelection(
            updatedEditorState,
            updatedEditorState.getSelection().merge({
              anchorOffset: blockText.length - markerLength,
              focusOffset: blockText.length - markerLength,
            })
          );

          // apply custom styles (BOLD, RED_COLOR, UNDERLINE_STYLE)
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
