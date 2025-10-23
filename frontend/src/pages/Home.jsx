import React from "react";
import FileUploader from "../components/FileUploader";
import ChatBox from "../components/ChatBox";

const Home = () => {
  return (
    <div className="p-6 space-y-6">
      <FileUploader />
      <ChatBox />
    </div>
  );
};

export default Home;
