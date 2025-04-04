import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { FaShareAlt } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const TabUI = ({ 
  libraries = [], 
  alerts = [], 
  expanded, 
  toggleExpand, 
  handleShare, 
  copyStatus 
}) => {
  const [activeTab, setActiveTab] = useState('resources');
  
  // Handle tab switching
  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="space-y-4">
      {/* Share button and copied notification */}
      <div className="flex justify-end">
        <button
          onClick={handleShare}
          className="text-[#4c4f69] dark:text-[#cdd6f4] hover:text-[#1e66f5] dark:hover:text-[#89b4fa] text-sm"
          title="Share Results"
        >
          <FaShareAlt />
        </button>
      </div>
      
      {/* Tab selector */}
      <div className="flex rounded-lg overflow-hidden">
        <button
          onClick={() => switchTab('resources')}
          className={`flex-1 py-3 px-4 ${
            activeTab === 'resources'
              ? 'bg-[#89b4fa] text-white font-medium'
              : 'bg-[#313244] text-[#cdd6f4]'
          }`}
        >
          External Resources ({libraries.length})
        </button>
        <button
          onClick={() => switchTab('alerts')}
          className={`flex-1 py-3 px-4 ${
            activeTab === 'alerts'
              ? 'bg-[#ef9f76] text-white font-medium'
              : 'bg-[#313244] text-[#cdd6f4]'
          }`}
        >
          <div className="flex items-center justify-center">
            JavaScript Alerts
            {alerts.length > 0 && (
              <span className="ml-2 bg-[#f38ba8] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {alerts.length}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {/* Libraries content */}
        {activeTab === 'resources' && (
          <div>
            {libraries.length === 0 ? (
              <div className="text-center text-[#d20f39] dark:text-[#f38ba8] mt-4 flex items-center justify-center">
                <em-emoji shortcodes=":x:" set="apple" size="1em"></em-emoji>
                <span className="ml-2 mt-1">No libraries detected</span>
              </div>
            ) : (
              libraries.map((lib, index) => {
                // Remove leading whitespace from each line
                const cleanedLines = lib.lines.map(line => line.trimStart()).join('\n');

                return (
                  <Card key={index} className="mt-4">
                    <button
                      onClick={() => toggleExpand(lib.name)}
                      className="w-full text-left"
                    >
                      <CardContent className="flex justify-between items-center p-4 hover:bg-[#e6e9ef] dark:hover:bg-[#313244] cursor-pointer">
                        <div className="flex items-center font-bold">
                          <span className="text-[#40a02b] dark:text-[#a6e3a1]">
                            <em-emoji shortcodes=":white_check_mark:" set="apple"></em-emoji>
                          </span>
                          <span className="mt-1 ml-2 capitalize text-[#1e1e2e] dark:text-[#cdd6f4] opacity-100">{lib.name}</span>
                        </div>
                        <span 
                          className="text-[#4c4f69] dark:text-[#cdd6f4] transition-transform duration-300"
                          style={{ transform: expanded[lib.name] ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                          ▼
                        </span>
                      </CardContent>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out ${expanded[lib.name] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                      <div className="bg-[#313244] p-2 rounded-b-lg">
                        <SyntaxHighlighter
                          language={lib.syntaxHighlightType}
                          style={dracula}
                          customStyle={{
                            backgroundColor: 'transparent',
                            paddingTop: '1em',
                            paddingBottom: '1em',
                            fontSize: '0.875rem'
                          }}
                        >
                          {cleanedLines}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Alerts content */}
        {activeTab === 'alerts' && (
          <div>
            {alerts.length === 0 ? (
              <div className="text-center text-[#d20f39] dark:text-[#f38ba8] mt-4 flex items-center justify-center">
                <em-emoji shortcodes=":x:" set="apple" size="1em"></em-emoji>
                <span className="ml-2 mt-1">No alerts detected</span>
              </div>
            ) : (
              alerts.map((alert, index) => {
                return (
                  <Card key={index} className="mt-4">
                    <button
                      onClick={() => toggleExpand(`alert-${alert.id}`)}
                      className="w-full text-left"
                    >
                      <CardContent className="flex justify-between items-center p-4 hover:bg-[#e6e9ef] dark:hover:bg-[#313244] cursor-pointer">
                        <div className="flex items-center font-bold">
                          <span className="text-[#f38ba8]">
                            <em-emoji shortcodes=":warning:" set="apple"></em-emoji>
                          </span>
                          <span className="mt-1 ml-2 capitalize text-[#1e1e2e] dark:text-[#cdd6f4] opacity-100">{alert.name}</span>
                        </div>
                        <span 
                          className="text-[#4c4f69] dark:text-[#cdd6f4] transition-transform duration-300"
                          style={{ transform: expanded[`alert-${alert.id}`] ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                          ▼
                        </span>
                      </CardContent>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out ${expanded[`alert-${alert.id}`] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                      <div className="bg-[#313244] p-2 rounded-b-lg">
                        <SyntaxHighlighter
                          language="javascript"
                          style={dracula}
                          customStyle={{
                            backgroundColor: 'transparent',
                            paddingTop: '1em',
                            paddingBottom: '1em',
                            fontSize: '0.875rem'
                          }}
                        >
                          {alert.code}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabUI;
