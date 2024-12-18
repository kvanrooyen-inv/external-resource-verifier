import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const StandardUI = () => {
  const [url, setUrl] = useState('');
  const [libraries, setLibraries] = useState([]);

  const handleVerify = async () => {
    console.log('Verifying URL:', url);
    const detectedLibraries = [
      { name: 'React', detected: true, line: 'import React from "react"' },
      { name: 'Vue', detected: false, line: null }
    ];
    setLibraries(detectedLibraries);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-zinc-950 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center mb-5 text-2xl">
            External Resource Checker
          </CardTitle>
          <p className="text-center text-sm mb-4 text-slate-600 dark:text-zinc-300">
            Enter a URL to verify whether or not it uses the requested resource.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="url"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 placeholder-slate-500 dark:placeholder-zinc-400"
            />
            <Button
              onClick={handleVerify}
              className="w-full text-slate-50"
            >
              Verify
            </Button>

            {libraries.map((lib, index) => (
              <Card key={index} className="mt-4">
                <CardContent className="flex justify-between items-center p-4">
                  <div className="flex items-center">
                    {lib.detected ? '✅' : '❌'}
                    <span className="ml-2">{lib.name}</span>
                  </div>
                  {lib.detected && (
                    <button className="text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100">
                      ▼
                    </button>
                  )}
                </CardContent>
                {lib.detected && (
                  <pre className="bg-slate-200 dark:bg-zinc-800 p-2 text-sm text-slate-800 dark:text-zinc-200 overflow-auto">
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

export default StandardUI;
