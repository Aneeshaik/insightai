import React, { useRef, useState } from "react";
import axios from "axios";
import { Paperclip, BookOpen, ArrowUp } from 'lucide-react';
import { useEffect } from "react";
import TypingEffect from "./TypingEffect";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const chatRef = useRef(null)

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
      setIsLoading(true)
      const res = await axios.post("http://localhost:5000/chat", {
        message: input,
      });
      setMessages((prev) => [...prev, { role: "ai", content: res.data.reply }]);
    } catch (err) {
      console.error(err);
      alert("Error fetching AI response!");
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    if(messages.length > 0 && messages[messages.length - 1].role === 'user'){
      chatRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }, [messages])

  useEffect(() => {
    if(file){
      handleUpload()
    }
  }, [file])

  return (
    <div className={`flex flex-col overflow-hidden ${
      messages.length > 0 ? "justify-between pt-12 h-[calc(100vh-64px)]" : "justify-end"
    }`}>
      <div ref={chatRef} className={`flex-1 flex flex-col overflow-y-auto space-y-2 ${
        messages.length > 0 ? "pb-4" : ""
      }`} style={{ scrollbarWidth: "none" }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`px-4 py-2 rounded-3xl w-fit ${
              msg.role === "user"
                ? "bg-[#1c2337] self-end text-right"
                : "bg-none self-start text-left"
            }`}
          >
            {msg.role === 'ai' ? <TypingEffect text={msg.content} speed={30} /> : msg.content}
          </div>
        ))}
        {isLoading && (
          <p className="text-gray-100 italic self-start text-left px-4 py-2 animate-pulse">
            Thinking...
          </p>
        )}
      </div>
      {messages.length === 0 && <p className="text-center my-8 text-2xl font-semibold">How Can I help you?</p>}
      <div className="flex flex-col items-start gap-2 bg-[#1c2337] p-2 rounded-3xl shadow-2xl">
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
          className="flex-1 focus:outline-none px-1 py-2 w-full"
        />
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-3 items-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
              <div className="flex gap-1.5 items-center border-1 px-2.5 py-1 border-gray-600 rounded-4xl">
                <Paperclip
                  size={15}
                />
                <p className="text-sm">Attach</p>
              </div>
            </label>
            <div className="flex gap-1.5 items-center border-1 px-2.5 py-1 border-gray-600 rounded-4xl cursor-pointer">
              <BookOpen
                size={15}
              />
              <p className="text-sm">Study</p>
            </div>
          </div>
          <ArrowUp
            size={30}
            className="bg-[#86a1ea] p-1 rounded-3xl text-black"
            onClick={handleSend}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
