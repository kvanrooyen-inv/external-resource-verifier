import React, { useEffect } from "react";
import { CircleHelp, Moon, Sun } from "lucide-react";
import { client } from "../lib/sanity.js";
import BlockContent from "@sanity/block-content-to-react";

const Dialog = ({ children, open, onOpenChange }) => (
  <div
    className={`fixed inset-0 z-50 bg-black/50 ${open ? "flex" : "hidden"} items-center justify-center`}
    onClick={() => onOpenChange(false)}
  >
    <div
      className="bg-white dark:bg-[#1e1e2e] rounded-lg shadow-lg max-w-md w-full mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

const DialogContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const DialogHeader = ({ children }) => (
  <div className="mb-4 flex justify-between items-center">{children}</div>
);

const DialogTitle = ({ children, className = "" }) => (
  <h2
    className={`text-2xl font-semibold text-[#4c4f69] dark:text-[#cdd6f4] ${className}`}
  >
    {children}
  </h2>
);

const HelpModal = ({ onSubmitUrl, theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [aboutData, setAboutData] = React.useState({
    title: "About",
    aboutDesc: [],
  });

  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch about data from Sanity
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setIsLoading(true);
        // GROQ query to fetch the about document
        const query = `*[_type == "about"][0]{
          title,
          aboutDesc
        }`;

        const data = await client.fetch(query);
        if (data) {
          setAboutData(data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching about data:", error);
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const shortcuts = [
    { key: "Enter", description: "Verify the URL." },
    { key: "?", description: "Open the help/about dialog window." },
    { key: "Esc", description: "Close the help/about dialog window." },
  ];

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check if we're in an input field
      const isInputActive =
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA";

      // Handle '?' key
      if (event.key === "?" && !isInputActive) {
        event.preventDefault();
        setIsOpen(true);
      }

      // Handle 'Enter' for URL verification
      if (event.key === "Enter" && !isOpen && isInputActive) {
        event.preventDefault();
        onSubmitUrl?.();
      }

      // Handle 'Escape' key
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isOpen, onSubmitUrl]);

  const serializers = {
    types: {
      block: (props) => {
        const { style = "normal" } = props.node;

        if (style === "normal") {
          return (
            <p className="text-sm text-[#4c4f69] dark:text-[#bac2de] mb-2">
              {props.children}
            </p>
          );
        }

        // Add other styles if needed
        return BlockContent.defaultSerializers.types.block(props);
      },
    },
    marks: {
      link: ({ mark, children }) => {
        const { href } = mark;
        const target = href.startsWith("http") ? "_blank" : undefined;
        return (
          <a
            href={href}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {children}
          </a>
        );
      },
    },
  };

  return (
    <>
      <button
        className="fixed bottom-4 right-4 z-40 p-0 bg-transparent border-none cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <CircleHelp className="w-6 h-6 text-black dark:text-white" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Help & About</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#4c4f69] dark:text-[#cdd6f4]">
                {aboutData.title}
              </h3>

              {!isLoading &&
              aboutData.aboutDesc &&
              aboutData.aboutDesc.length > 0 ? (
                <BlockContent
                  blocks={aboutData.aboutDesc}
                  serializers={serializers}
                  projectId={client.config().projectId}
                  dataset={client.config().dataset}
                />
              ) : (
                <p className="text-sm text-[#4c4f69] dark:text-[#bac2de] mb-2">
                  {isLoading ? "Loading..." : "No content available."}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#4c4f69] dark:text-[#cdd6f4]">
                Display Settings
              </h3>
              <button
                onClick={toggleTheme}
                type="button"
                className="flex items-center justify-between text-sm text-[#4c4f69] dark:text-[#bac2de] p-2 bg-[#e6e9ef] dark:bg-[#313244] rounded w-full transition-colors"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              >
                <span>Theme</span>
                <div className="flex items-center gap-2">
                  <span>{theme === "dark" ? "Dark" : "Light"}</span>
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4 text-[#cdd6f4]" />
                  ) : (
                    <Moon className="w-4 h-4 text-[#4c4f69]" />
                  )}
                </div>
              </button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#4c4f69] dark:text-[#cdd6f4]">
                Keyboard Shortcuts
              </h3>
              <div className="space-y-2">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <kbd className="px-2 py-1 bg-[#e6e9ef] dark:bg-[#313244] rounded text-[#4c4f69] dark:text-[#bac2de]">
                      {shortcut.key}
                    </kbd>
                    <span className="text-[#4c4f69] dark:text-[#bac2de]">
                      {shortcut.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#4c4f69] dark:text-[#cdd6f4]">
                Version
              </h3>
              <p className="text-sm text-[#4c4f69] dark:text-[#bac2de]">
                v1.0.1
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HelpModal;
