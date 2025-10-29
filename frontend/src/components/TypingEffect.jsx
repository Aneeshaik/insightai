import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TypingEffect = ({ text, speed, onDone }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!text) return;

    // Reset index when text changes
    setIndex(0);

    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= text.length) {
          clearInterval(interval);
          if (onDone) onDone();
        }
        return nextIndex;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onDone]);

  // Slice the text up to the current index
  const displayedText = text.slice(0, index);

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedText}</ReactMarkdown>;
};

export default TypingEffect;