import React, { useEffect } from 'react';
import { CircleHelp } from 'lucide-react';

const Dialog = ({ children, open, onOpenChange }) => (
  <div 
    className={`fixed inset-0 z-50 bg-black/50 ${open ? 'flex' : 'hidden'} items-center justify-center`}
    onClick={() => onOpenChange(false)}
  >
    <div 
      className="bg-white dark:bg-[#1e1e2e] rounded-lg shadow-lg max-w-md w-full mx-4"
      onClick={e => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

const DialogContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const DialogHeader = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
);

const DialogTitle = ({ children, className = "" }) => (
  <h2 className={`text-2xl font-semibold text-[#4c4f69] dark:text-[#cdd6f4] ${className}`}>
    {children}
  </h2>
);

const HelpModal = ({ onSubmitUrl }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const shortcuts = [
    { key: 'Enter', description: 'Verify the URL.' },
    { key: '?', description: 'Open the help/about dialog window.'},
    { key: 'Esc', description: 'Close the help/about dialog window.'}
  ];

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check if we're in an input field
      const isInputActive = document.activeElement.tagName === 'INPUT' ||
                          document.activeElement.tagName === 'TEXTAREA';

      // Handle '?' key
      if (event.key === '?' && !isInputActive) {
        event.preventDefault();
        setIsOpen(true);
      }

      // Handle 'Enter' for URL verification
      if (event.key === 'Enter' && !isOpen && isInputActive) {
        event.preventDefault();
        onSubmitUrl?.();
      }

      // Handle 'Escape' key
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        setIsOpen(false);
      }
    };

    // Add the event listener
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isOpen, onSubmitUrl]);

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
              <h3 className="text-lg font-semibold mb-2 text-[#4c4f69] dark:text-[#cdd6f4]">About</h3>
              <p className="text-sm text-[#4c4f69] dark:text-[#bac2de]">
                External Resource Checker helps you identify external libraries and resources used on any website. 
                Simply enter a URL, and the tool will scan the page for common frameworks, libraries, and resources.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#4c4f69] dark:text-[#cdd6f4]">Keyboard Shortcuts</h3>
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
              <h3 className="text-lg font-semibold mb-2 text-[#4c4f69] dark:text-[#cdd6f4]">Version</h3>
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
