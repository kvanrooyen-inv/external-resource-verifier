import React, { useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Footer from '../components/ui/footer';


const friendlyOSName = () => {
  const platform = navigator.platform.toLowerCase();
  if (platform.includes('win')) return 'Windows';
  if (platform.includes('mac')) return 'MacOS';
  if (platform.includes('linux')) return 'Linux';
  return 'Unknown'; // default or 'Unknown' if preferred
};

const ShareUI = ({ url, detectedLibraries }) => {
  const getLanguage = (libName) => {
    // Only webgl uses JS syntax highlighting; all others use HTML
    return libName === 'webgl' ? 'javascript' : 'html';
  };

  const osName = friendlyOSName();
  const [expanded, setExpanded] = useState({});

  // Add a toggle function
  const toggleExpand = (libraryName) => {
    setExpanded((prev) => ({ ...prev, [libraryName]: !prev[libraryName] }));
  };

   return (
    <div className="min-h-screen bg-[#e6e9ef] dark:bg-[#1e1e2e] flex items-center justify-center">
      <Card className="w-full max-w-md bg-[#eff1f5] dark:bg-[#181825] border-[#9ca0b0] dark:border-[#313244]">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            External Resource Checker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Information Box */}
            <div className="bg-[#e6e9ef] dark:bg-[#313244] p-4 rounded-md text-[#4c4f69] dark:text-[#cdd6f4]">
              <p><strong>OS:</strong> {osName}</p>
              <p><strong>Timestamp:</strong> {new Date().toLocaleString()} {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
              <p className="flex">
                <strong className="flex-shrink-0">URL:</strong>{' '}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1e66f5] dark:text-[#89b4fa] underline truncate ml-1"
                  title={url}
                >
                  {url}
                </a>
              </p>
            </div>
            {/* Detected Libraries */}
            {detectedLibraries.map((lib, index) => {
              const cleanedLine = lib.line ? lib.line.split('\n').map(l => l.trimStart()).join('\n') : '';
              return (
                <Card key={index}>
                  {lib.detected && (
                    <button
                      onClick={() => toggleExpand(lib.name)}
                      className="w-full text-left"
                    >
                      <CardContent className="flex justify-between items-center p-4 text-[#4c4f69] dark:text-[#cdd6f4] font-bold hover:bg-[#e6e9ef] dark:hover:bg-[#313244] cursor-pointer">
                        <div className="flex items-center">
                          {lib.detected ?
                            <em-emoji shortcodes=":white_check_mark:" set="apple"></em-emoji> :
                            <em-emoji shortcodes=":x:" set="apple" size="1em"></em-emoji>
                          }
                          <span className="ml-2 mt-1 capitalize">{lib.name}</span>
                        </div>
                        <span className="transition-transform duration-300"
                              style={{ transform: expanded[lib.name] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          ▼
                        </span>
                      </CardContent>
                    </button>
                  )}
                  {!lib.detected && (
                    <CardContent className="flex items-center p-4 text-[#4c4f69] dark:text-[#cdd6f4] font-bold">
                      <div className="flex items-center">
                        <em-emoji shortcodes=":x:" set="apple" size="1em"></em-emoji>
                        <span className="ml-2 mt-1 capitalize">{lib.name}</span>
                      </div>
                    </CardContent>
                  )}
                  <div className={`transition-all duration-300 ease-in-out ${lib.detected && expanded[lib.name] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                    <div className="bg-[#313244] dark:bg-[#11111b] p-2 rounded-b-lg">
                      <SyntaxHighlighter
                        language={getLanguage(lib.name)}
                        style={dracula}
                        customStyle={{
                          backgroundColor: 'transparent',
                          paddingTop: '1em',
                          paddingBottom: '1em',
                          fontSize: '0.875rem'
                        }}
                      >
                        {cleanedLine}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
};

export default ShareUI;
