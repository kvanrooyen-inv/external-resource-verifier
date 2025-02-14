import React from 'react';
import { Button } from '../components/ui/button';
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

const HelpModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const shortcuts = [
    { key: 'Enter', description: 'Verify URL' },
    { key: 'Esc', description: 'Close expanded library details' },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4 z-40 w-10 h-10 text-[#4c4f69] dark:text-[#cdd6f4] hover:bg-transparent hover:text-[#1e66f5] dark:hover:text-[#89b4fa]"
        onClick={() => setIsOpen(true)}
      >
        <CircleHelp className="w-6 h-6" />
      </Button>

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
                v1.0.0
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HelpModal;
