
import React, { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { compressToEncodedURIComponent } from 'lz-string';
import { FaShareAlt } from 'react-icons/fa'; // Using react-icons for Font Awesome
import data from '@emoji-mart/data'
import { init } from 'emoji-mart'
import Footer from '../components/ui/footer';
import HelpModal from '../components/HelpModal.js'

init({ data })

const LIBRARY_DETECTION_METHODS = {
  bootstrap: (htmlStr) =>
    htmlStr
      .split("\n")
      .filter(
        (line) =>
          line.toLowerCase().includes("bootstrap.css") ||
          line.toLowerCase().includes("bootstrap.min.css") ||
          line.toLowerCase().includes("cdn.jsdelivr.net/npm/bootstrap"),
      ),
  vue: (htmlStr) =>
    htmlStr
      .split("\n")
      .filter(
        (line) =>
          line.toLowerCase().includes("vue.js") ||
          line.toLowerCase().includes("vue.min.js") ||
          line.toLowerCase().includes("vue-router") ||
          line.toLowerCase().includes("vuex") ||
          line.toLowerCase().includes("vue.global.js"),
      ),
  react: (htmlStr) =>
    htmlStr
      .split("\n")
      .filter(
        (line) =>
          line.toLowerCase().includes("react.js") ||
          line.toLowerCase().includes("react.production.min.js") ||
          line.toLowerCase().includes("react.development.js") ||
          line.toLowerCase().includes("react-dom.development.js") ||
          line.toLowerCase().includes("react-dom.js"),
      ),
  tailwind: (htmlStr) =>
    htmlStr
      .split("\n")
      .filter(
        (line) =>
          line.toLowerCase().includes("tailwind.css") ||
          line.toLowerCase().includes("tailwindcss") ||
          line.toLowerCase().includes("cdn.tailwindcss.com"),
      ),
  jquery: (htmlStr) =>
    htmlStr
      .split("\n")
      .filter(
        (line) =>
          line.toLowerCase().includes("jquery.js") ||
          line.toLowerCase().includes("jquery.min.js"),
      ),
  angular: (htmlStr) =>
    htmlStr
      .split("\n")
      .filter(
        (line) =>
          line.toLowerCase().includes("angular.js") ||
          line.toLowerCase().includes("angular.min.js") ||
          line.toLowerCase().includes("@angular/core"),
      ),
  fontAwesome: (htmlStr) =>
    htmlStr
      .split("\n")
      .filter(
        (line) =>
          line.toLowerCase().includes("font-awesome") ||
          line.toLowerCase().includes("fontawesome") ||
          line.toLowerCase().includes("fa-"),
      ),
   calcite: (htmlStr) =>
    htmlStr
      .split("\n")
      .filter(
        (line) =>
          line.toLowerCase().includes("calcite.css") ||
          line.toLowerCase().includes("calcite.js") ||
          line.toLowerCase().includes("calcite.esm.js") ||
          line.toLowerCase().includes("calcite.min.js"),
    ),
  webgl: (htmlStr) =>
    htmlStr
      .split("\n")
      .filter(
        (line) =>
          line.toLowerCase().includes("webgl") ||
          line.toLowerCase().includes("three.js") ||
          line.toLowerCase().includes("babylon.js") ||
          line.toLowerCase().includes("gl-matrix.js") ||
          line.toLowerCase().includes('canvas.getcontext("webgl")'),
      ),
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
  };

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
      const res = await fetch(`/.netlify/functions/fetch-url?url=${encodeURIComponent(url)}`);
        if (!res.ok) {
          throw new Error('ERROR_FETCHING_URL');
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
      setSearched(true);
    } catch (e) {
      console.error(e);
      if (e.message === 'CORS_ERROR' || e.message === 'INVALID_RESPONSE') {
        setError('Unable to scrape website data. Please try again later.');
      } else {
        setError('There was an error fetching or processing the provided URL.');
      }
      setSearched(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (libraryName) => {
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
    <div className="min-h-screen bg-[#e6e9ef] dark:bg-[#1e1e2e] flex flex-col items-center justify-center">
        {copied && (
        <div className="absolute top-4 bg-[#313244] text-[#cdd6f4] px-4 py-2 rounded-md shadow-md text-sm">
          Share link copied!
        </div>
      )}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center mb-5 text-2xl">
            External Resource Checker
          </CardTitle>
          <p className="text-center text-sm mb-4 text-[#5c5f77] dark:text-[#bac2de]">
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
              />
              {libraries.length > 0 && (
                <button
                  onClick={handleShare}
                  className="text-[#4c4f69] dark:text-[#cdd6f4] hover:text-[#1e66f5] dark:hover:text-[#89b4fa] text-sm"
                  title="Share Results"
                >
                  <FaShareAlt />
                </button>
              )}
            </div>
            {error && <p className="text-[#d20f39] dark:text-[#f38ba8] text-sm">{error}</p>}
            <Button
              onClick={handleVerify}
              className="w-full text-slate-50"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>

            {(!loading && searched && libraries.length === 0 && !error) && (
              <div className="text-center text-[#d20f39] dark:text-[#f38ba8] mt-4 flex items-center justify-center">
                <em-emoji shortcodes=":x:" set="apple" size="1em"></em-emoji>
                <span className="ml-2 mt-1">No libraries detected</span>
              </div>
            )}

            {libraries.map((lib, index) => {
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
                      <span className="text-[#4c4f69] dark:text-[#cdd6f4] transition-transform duration-300"
                            style={{ transform: expanded[lib.name] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        ▼
                      </span>
                    </CardContent>
                  </button>
                  <div className={`transition-all duration-300 ease-in-out ${expanded[lib.name] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                    <div className="bg-[#313244] p-2 rounded-b-lg">
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
                        {cleanedLines}
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
      <HelpModal onSubmitUrl={handleVerify}/>
    </div>
  );
};

export default StandardUI;
