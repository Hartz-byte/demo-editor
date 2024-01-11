import React from "react";
import "./App.css";
import Title from "./components/Title/Title";
import Button from "./components/Button/Button";
import Editor from "./components/Editor/Editor";

const App = () => {
  const handleSave = () => {
    console.log("Content saved!");
  };

  return (
    <div>
      <Title />
      <Button onClick={() => {}} label="Your Button" />
      <Editor onSave={handleSave} />
    </div>
  );
};

export default App;
