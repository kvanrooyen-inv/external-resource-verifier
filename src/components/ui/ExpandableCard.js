import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Card, CardContent } from "./card.js";

const ExpandableCard = ({
  itemName,
  displayName,
  icon,
  content,
  expanded,
  toggleExpand,
  language = "javascript",
  type = "library", // You can add a type prop to determine the default icon
}) => {
  // Determine icon based on type if no custom icon is provided
  const defaultIcons = {
    library: {
      className: "text-[#40a02b] dark:text-[#a6e3a1]",
      emoji: ":white_check_mark:",
    },
    alert: {
      className: "text-[#f38ba8]",
      emoji: ":warning:",
    },
  };

  // Use the provided icon, or fall back to default based on type
  const displayIcon = icon || defaultIcons[type] || defaultIcons.library;

  return (
    <Card className="mt-4">
      <button
        onClick={() => toggleExpand(itemName)}
        className="w-full text-left"
      >
        <CardContent className="flex justify-between items-center p-4 hover:bg-[#e6e9ef] dark:hover:bg-[#313244] cursor-pointer">
          <div className="flex items-center font-bold">
            <span className={displayIcon.className}>
              <em-emoji shortcodes={displayIcon.emoji} set="apple"></em-emoji>
            </span>
            <span className="mt-1 ml-2 capitalize text-[#1e1e2e] dark:text-[#cdd6f4] opacity-100">
              {displayName}
            </span>
          </div>
          <span
            className="text-[#4c4f69] dark:text-[#cdd6f4] transition-transform duration-300"
            style={{
              transform: expanded[itemName] ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </CardContent>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${expanded[itemName] ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
      >
        <div className="bg-[#313244] p-2 rounded-b-lg">
          <SyntaxHighlighter
            language={language}
            style={dracula}
            customStyle={{
              backgroundColor: "transparent",
              paddingTop: "1em",
              paddingBottom: "1em",
              fontSize: "0.875rem",
            }}
          >
            {content}
          </SyntaxHighlighter>
        </div>
      </div>
    </Card>
  );
};

export default ExpandableCard;
