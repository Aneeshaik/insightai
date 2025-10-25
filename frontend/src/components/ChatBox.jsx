import React, { useState } from "react";
import axios from "axios";
import { Plus, ArrowUp } from 'lucide-react';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
    const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:5000/upload", formData);
      alert(res.data.message || "File uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message: input,
      });
      setMessages((prev) => [...prev, { role: "ai", content: res.data.reply }]);
    } catch (err) {
      console.error(err);
      alert("Error fetching AI response!");
    }
  };

  return (
    <div className={`flex flex-col overflow-hidden ${
      messages.length > 0 ? "justify-between pt-12 h-[calc(100vh-64px)]" : "justify-end"
    }`}>
      <div className={`flex-1 flex flex-col overflow-y-auto space-y-2 ${
        messages.length > 0 ? "pb-4" : ""
      }`}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`px-4 py-2 rounded-3xl w-fit ${
              msg.role === "user"
                ? "bg-[#1c2337] self-end text-right"
                : "bg-none self-start text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 bg-[#1c2337] px-3 rounded-3xl shadow-2xl">
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
          <Plus 
            onClick={handleUpload}
          />
        </label>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === "Enter" && !e.shiftKey){
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Ask something..."
          className="flex-1 focus:outline-none px-1 py-3.5"
        />
        <ArrowUp
          size={30}
          className="bg-[#86a1ea] p-1 rounded-3xl text-black"
          onClick={handleSend}
        />
      </div>
    </div>
  );
};

export default ChatBox;
