
import React, { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { compressToEncodedURIComponent } from 'lz-string';
import { FaShareAlt } from 'react-icons/fa'; // Using react-icons for Font Awesome

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
    line.toLowerCase().includes('fontawesome')
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
  const [copied, setCopied] = useState(false);

  const isValidURL = (input) => {
    try {
      new URL(input);
      return true;
    } catch (_) {
      return false;
    }
  }

const handleVerify = async () => {
  setError('');
  setLibraries([]);
  setExpanded({});
  setSearched(false);
  setCopied(false);

  if (!isValidURL(url)) {
    setError('Please enter a valid URL.');
    return;
  }

  setLoading(true);
  try {
    // Use Netlify Function endpoint
    const res = await fetch(`/.netlify/functions/fetch-url?url=${encodeURIComponent(url)}`);
    
    // Check if the response is ok
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
    }
    
    const data = await res.json();
    
    // Additional check for contents
    if (!data || !data.contents) {
      throw new Error('No content received from the URL');
    }

    const html = data.contents;

    const detected = Object.entries(LIBRARY_DETECTION_METHODS).reduce((acc, [libName, detector]) => {
      const lines = detector(html);
      if (lines.length > 0) {
        acc.push({ name: libName, lines });
      }
      return acc;
    }, []);

    setLibraries(detected);
  } catch (e) {
    console.error('Verification error:', e);
    setError(e.message || 'There was an error fetching or processing the provided URL.');
  } finally {
    setLoading(false);
    setSearched(true);
  }
};  const toggleExpand = (libraryName) => {
    setExpanded((prev) => ({ ...prev, [libraryName]: !prev[libraryName] }));
  };

  const getLanguage = (libName) => {
    // Only webgl uses JS syntax highlighting; all others use HTML
    return libName === 'webgl' ? 'javascript' : 'html';
  };

  const handleShare = async () => {
    const payload = {
      url,
      detectedLibraries: libraries.map((lib) => ({
        name: lib.name,
        detected: true,
        line: lib.lines.join('\n')
      }))
    };

    const compressed = compressToEncodedURIComponent(JSON.stringify(payload));
    const shareURL = `${window.location.origin}?share=${compressed}`;

    try {
      await navigator.clipboard.writeText(shareURL);
      setCopied(true); 
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

   // Hide the copied message after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-zinc-950 flex flex-col items-center justify-center">
        {copied && (
        <div className="absolute top-4 bg-gray-800 text-gray-100 px-4 py-2 rounded-md shadow-md text-sm">
          Share link copied!
        </div>
      )}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center mb-5 text-2xl">
            External Resource Checker
          </CardTitle>
          <p className="text-center text-sm mb-4 text-slate-600 dark:text-zinc-300">
            Enter a URL to verify whether it uses certain external resources.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                type="url"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 placeholder-slate-500 dark:placeholder-zinc-400"
              />
              {libraries.length > 0 && (
                <button
                  onClick={handleShare}
                  className="text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100 text-sm"
                  title="Share Results"
                >
                  <FaShareAlt />
                </button>
              )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              onClick={handleVerify}
              className="w-full text-slate-50"
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
