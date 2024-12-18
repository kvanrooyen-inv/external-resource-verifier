import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const ShareUI = ({ url, detectedLibraries }) => {
  return (
    <div className="min-h-screen bg-background-color dark:bg-background-color-dark flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl dark:text-text-color-dark">
            External Resource Checker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <p>OS: {navigator.platform}</p>
              <p>Date/Time: {new Date().toLocaleString()} {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
              <p>URL: {url}</p>
            </div>
            
            {detectedLibraries.map((lib, index) => (
              <Card key={index} className="mt-4">
                <CardContent className="flex justify-between items-center p-4">
                  <div className="flex items-center">
                    {lib.detected ? '✅' : '❌'}
                    <span className="ml-2">{lib.name}</span>
                  </div>
                  {lib.detected && (
                    <button className="text-blue-500">
                      ▼
                    </button>
                  )}
                </CardContent>
                {lib.detected && (
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 text-sm">
                    {lib.line}
                  </pre>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShareUI;
