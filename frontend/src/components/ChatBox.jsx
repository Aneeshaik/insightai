import React, { useCallback, useRef, useState } from "react";
import axios from "axios";
import { Paperclip, BookOpen, ArrowUp, File, X } from 'lucide-react';
import { useEffect } from "react";
import TypingEffect from "./TypingEffect";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false)
  const [uploading, setUploading] = useState(false)
  const chatRef = useRef(null)
  const lastMessageRef = useRef(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await axios.post("https://paper-brain-94qd.vercel.app/upload", formData);
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { 
      role: "user", 
      content: input,
      ...(file && { file })
    };

    setMessages((prev) => [
      ...prev, 
      newMessage, 
      { role: "ai", content: "" }
    ]);
    setInput("");
    setFile(null)

    try {
      if(file){
        await handleUpload()
      }
      setIsTyping(true)
      const res = await axios.post("https://paper-brain-94qd.vercel.app/chat", {
        message: input,
      });
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length-1] = { role: "ai", content: res.data.reply }
        return updated
      })
      // setMessages((prev) => [...prev, { role: "ai", content: res.data.reply }]);
    } catch (err) {
      console.error(err);
      alert("Error fetching AI response!");
    }
  };

  const handleTypingScroll = useCallback(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  useEffect(() => {
    if(messages.length > 0 && lastMessageRef.current){
      setTimeout(() => {
        lastMessageRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 1000);
    }
  }, [messages])

  return (
    <div className={`flex flex-col ${
      messages.length > 0 ? "h-[calc(100vh-44px)]" : ""
    }`}>
      {messages.length > 0 && <div className="h-10 flex-shrink-0" />}
      <div ref={chatRef} className={`flex-1 flex flex-col overflow-y-auto space-y-2 ${
        messages.length > 0 ? "pb-4" : "justify-end"
      }`} style={{ scrollbarWidth: "none" }}>
       {messages.map((msg, i) => (
          <div key={i} className="relative flex flex-col gap-2">
            {/* File preview (only for user messages when file exists) */}
            {msg.file && (
              <div className="relative flex items-start self-end gap-2 border border-[#323232] py-2 px-4 rounded-2xl w-fit">
                <File size={30} />

                <div className="mt-[-2px]">
                  <p className="text-sm font-medium">{msg.file.name}</p>
                  <p className="text-xs text-gray-400">
                    {msg.file.type ? msg.file.type.split('/')[1]?.toUpperCase() : 'UNKNOWN'}
                  </p>
                </div>
              </div>
            )}

            {/* Message bubble */}
            <div
              ref={i === messages.length - 1 ? lastMessageRef : null}
              className={`py-2 rounded-3xl w-fit ${
                msg.role === 'user'
                  ? 'bg-[#1c2337] self-end text-right px-4 text-white'
                  : 'bg-transparent self-start text-left text-gray-200'
              }`}
            >
              {msg.role === 'ai' ? (
                <TypingEffect 
                  text={msg.content} 
                  speed={30}
                  isTyping={isTyping}
                  setIsTyping={setIsTyping}
                  onTyping={handleTypingScroll}
                  showCursor={i === messages.length - 1}
                />
              ) : (
                msg?.content && <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {messages.length === 0 && <p className="text-center my-8 text-2xl font-semibold">How Can I help you?</p>}
      <div className="flex flex-col items-start gap-2 bg-[#1c2337] p-2 rounded-3xl shadow-2xl">
        {file && <div className="relative flex items-start gap-2 border-1 border-[#323232] py-2 px-2 rounded-2xl">
          <File 
            size={30}
          />
          <div className="mt-[-5px]">
            <p>{file.name}</p>
            <p className="text-xs">{file.type.split('/')[1].toUpperCase()}</p>
          </div>
          <X 
            className="ml-3 cursor-pointer"
            size={15}
            onClick={() => setFile(null)}
          />
        </div>}
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            const textarea = e.target;
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // Grow to content height or max-height
          }}
          onKeyDown={(e) => {
            if(e.key === "Enter" && !e.shiftKey){
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Ask something..."
          className="focus:outline-none px-1 w-full bg-transparent text-white resize-none overflow-y-auto"
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