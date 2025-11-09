import React from "react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TypingEffect = ({ text, speed, onTyping, onDone, isTyping, setIsTyping, showCursor }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!text) return;

    // Reset index when text changes
    setIndex(0);

    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        // if(nextIndex > 5) setIsTyping(false)
        if(onTyping) onTyping()
        if (nextIndex >= text.length) {
          clearInterval(interval);
          if (onDone) onDone();
        }
        return nextIndex;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onTyping, setIsTyping, onDone]);

  // Slice the text up to the current index
  const displayedText = text.slice(0, index);

  return (
    <div className="flex">
      <div>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {displayedText}
        </ReactMarkdown>
      </div>
      {isTyping && showCursor && displayedText.length <=5 && <span className="animate-pulse">|</span>}
    </div>
  )
};

export default React.memo(TypingEffect);