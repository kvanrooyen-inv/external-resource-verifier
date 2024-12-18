import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-zinc-950 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            External Resource Checker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Information Box */}
            <div className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-md text-slate-900 dark:text-zinc-100">
              <p><strong>OS:</strong> {osName}</p>
              <p><strong>Timestamp:</strong> {new Date().toLocaleString()} {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
              <p>
                <strong>URL:</strong>{' '}
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  {url}
                </a>
              </p>
          </div>        
            {/* Detected Libraries */}
            {detectedLibraries.map((lib, index) => {
            const cleanedLine = lib.line ? lib.line.split('\n').map(l => l.trimStart()).join('\n') : '';
              return (
                <Card key={index} className="mt-4">
                  <CardContent className="flex justify-between items-center p-4 text-slate-900 dark:text-zinc-100">
                    <div className="flex items-center">
                      {lib.detected ? '✅' : '❌'}
                      <span className="ml-2 capitalize">{lib.name}</span>
                    </div>
                    {lib.detected && (
                      <button className="text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100">
                        ▼
                      </button>
                    )}
                  </CardContent>
                  {lib.detected && (
                    <div className="bg-zinc-800 p-2 rounded-b-lg">
                      <SyntaxHighlighter
                        language={getLanguage(lib.name)}
                        style={dracula}
                        customStyle={{
                          backgroundColor: 'transparent',
                          paddingTop: '1em',
                          paddingBottom: '1em',
                          fontSize: '0.875rem' // text-sm
                        }}
                      >
                        {cleanedLine}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShareUI;
