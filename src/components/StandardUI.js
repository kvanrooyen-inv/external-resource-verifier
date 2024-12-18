
import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const LIBRARY_DETECTION_METHODS = {
  bootstrap: (htmlStr) => htmlStr.split('\n').filter(line =>
    line.toLowerCase().includes('bootstrap.css') ||
    line.toLowerCase().includes('bootstrap.min.css') ||
    line.toLowerCase().includes('cdn.jsdelivr.net/npm/bootstrap')
  ),
  vue: (htmlStr) => htmlStr.split('\n').filter(line =>
    line.toLowerCase().includes('vue.js') ||
    line.toLowerCase().includes('vue.min.js') ||
    line.toLowerCase().includes('vue-router') ||
    line.toLowerCase().includes('vuex') ||
    line.toLowerCase().includes('vue.global.js')
  ),
  react: (htmlStr) => htmlStr.split('\n').filter(line =>
    line.toLowerCase().includes('react.js') ||
    line.toLowerCase().includes('react.production.min.js') ||
    line.toLowerCase().includes('react.development.js') ||
    line.toLowerCase().includes('react-dom.development.js') ||
    line.toLowerCase().includes('react-dom.js')
  ),
  tailwind: (htmlStr) => htmlStr.split('\n').filter(line =>
    line.toLowerCase().includes('tailwind.css') ||
    line.toLowerCase().includes('tailwindcss') ||
    line.toLowerCase().includes('cdn.tailwindcss.com')
  ),
  jquery: (htmlStr) => htmlStr.split('\n').filter(line =>
    line.toLowerCase().includes('jquery.js') ||
    line.toLowerCase().includes('jquery.min.js')
  ),
  angular: (htmlStr) => htmlStr.split('\n').filter(line =>
    line.toLowerCase().includes('angular.js') ||
    line.toLowerCase().includes('angular.min.js') ||
    line.toLowerCase().includes('@angular/core')
  ),
  fontAwesome: (htmlStr) => htmlStr.split('\n').filter(line =>
    line.toLowerCase().includes('font-awesome') ||
    line.toLowerCase().includes('fontawesome') ||
    line.toLowerCase().includes('fa-')
  ),
  webgl: (htmlStr) => htmlStr.split('\n').filter(line =>
    line.toLowerCase().includes('webgl') ||
    line.toLowerCase().includes('three.js') ||
    line.toLowerCase().includes('babylon.js') ||
    line.toLowerCase().includes('gl-matrix.js') ||
    line.toLowerCase().includes('canvas.getcontext("webgl")')
  )
};

const StandardUI = () => {
  const [url, setUrl] = useState('');
  const [libraries, setLibraries] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [searched, setSearched] = useState(false);

  const isValidURL = (input) => {
    try {
      new URL(input);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleVerify = async () => {
    setError('');
    setLibraries([]);
    setExpanded({});
    setSearched(false);

    if (!isValidURL(url)) {
      setError('Please enter a valid URL.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Error fetching URL. Status: ${res.status}`);
      }
      const html = await res.text();

      const detected = Object.entries(LIBRARY_DETECTION_METHODS).reduce((acc, [libName, detector]) => {
        const lines = detector(html);
        if (lines.length > 0) {
          acc.push({ name: libName, lines });
        }
        return acc;
      }, []);

      setLibraries(detected);
    } catch (e) {
      console.error(e);
      setError('There was an error fetching or processing the provided URL.');
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const toggleExpand = (libraryName) => {
    setExpanded((prev) => ({ ...prev, [libraryName]: !prev[libraryName] }));
  };

  const getLanguage = (libName) => {
    // Only webgl uses JS syntax highlighting; all others use HTML
    return libName === 'webgl' ? 'javascript' : 'html';
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              onClick={handleVerify}
              className="w-full text-slate-50 hover:bg-slate-900"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>

            {(!loading && searched && libraries.length === 0 && !error) && (
              <div className="text-center text-slate-700 dark:text-zinc-300 mt-4">
                ❌ No libraries detected
              </div>
            )}

            {libraries.map((lib, index) => {
              // Remove leading whitespace from each line
              const cleanedLines = lib.lines.map(line => line.trimStart()).join('\n');

              return (
                <Card key={index} className="mt-4">
                  <CardContent className="flex justify-between items-center p-4">
                    <div className="flex items-center text-slate-900 dark:text-zinc-100">
                      ✅ <span className="ml-2 capitalize">{lib.name}</span>
                    </div>
                    <button
                      className="text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100"
                      onClick={() => toggleExpand(lib.name)}
                    >
                      {expanded[lib.name] ? '▲' : '▼'}
                    </button>
                  </CardContent>
                  {expanded[lib.name] && (
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
                        {cleanedLines}
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

export default StandardUI;
