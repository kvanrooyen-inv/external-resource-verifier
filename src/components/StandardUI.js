
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
import { client } from '../lib/sanity.js'
import TabUI from '../components/TabUI.js';

init({ data })

const StandardUI = () => {
  const [url, setUrl] = useState('');
  const [libraries, setLibraries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [libraryRules, setLibraryRules] = useState([]);

  useEffect(() => {
  const fetchLibraryRules = async () => {
    try {
      const query = `*[_type == "library"] {
        displayName,
        keywords,
        syntaxHighlightType
      }`
      const rules = await client.fetch(query)
      setLibraryRules(rules)
    } catch (err) {
      console.error('Error fetch library rules: ', err)
      setError('Error loading library detection rules.')
    }
  }

  fetchLibraryRules()
}, [])

  const isValidURL = (input) => {
    try {
      new URL(input);
      return true;
    } catch (_) {
      return false;
    }
  };
    // Function to detect JavaScript alerts in the HTML
  const detectJavaScriptAlerts = (html) => {
    // Simple regex to detect alert() patterns in scripts
    const alertPattern = /alert\s*\([^)]*\)/g;
    const matches = html.match(alertPattern);
    
    if (matches && matches.length > 0) {
      // Create alert objects similar to library objects
      return [{
        id: 1,
        name: 'JavaScript Alert',
        code: matches.join('\n'),
      }];
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

      const detected = libraryRules.reduce((acc, rule) => {
        const { displayName, keywords, syntaxHighlightType } = rule;
        // Split the HTML into lines and check if any keyword appears in a line
        const lines = html.split("\n").filter(line =>
          keywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase()))
        );
        if (lines.length > 0) {
          acc.push({
            name: displayName,
            lines,
            syntaxHighlightType,
         });
        }
        return acc;
      }, []);
      
      setLibraries(detected);

      // Detect JavaScript alerts
      const detectedAlerts = detectJavaScriptAlerts(html);
      setAlerts(detectedAlerts);

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
