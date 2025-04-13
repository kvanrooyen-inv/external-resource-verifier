import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Footer from '../components/ui/footer';

const ReportPage = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [libraries, setLibraries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});
  const [activeTab, setActiveTab] = useState('libraries');

  // Get friendly OS name
  const getFriendlyOSName = (osName) => {
    if (!osName) return 'Unknown';
    
    // For Linux
    if (osName.toLowerCase().includes('linux')) {
      return 'Linux';
    }
    
    // For Windows
    if (osName.toLowerCase().includes('windows')) {
      if (osName.includes('10')) return 'Windows 10';
      if (osName.includes('11')) return 'Windows 11';
      if (osName.includes('8')) return 'Windows 8';
      if (osName.includes('7')) return 'Windows 7';
      return 'Windows';
    }
    
    // For macOS
    if (osName.toLowerCase().includes('darwin') || 
        osName.toLowerCase().includes('mac')) {
      if (osName.includes('10.15')) return 'macOS Catalina';
      if (osName.includes('11')) return 'macOS Big Sur';
      if (osName.includes('12')) return 'macOS Monterey';
      if (osName.includes('13')) return 'macOS Ventura';
      if (osName.includes('14')) return 'macOS Sonoma';
      return 'macOS';
    }
    
    return osName;
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/.netlify/functions/get-report/${reportId}`);
        if (!response.ok) {
          throw new Error('Report not found');
        }
        const data = await response.json();
        
        // Set the full report data
        setReport(data);
        
        // Process libraries and alerts
        if (data.detectedLibraries) {
          // Check if we have a separate detectedAlerts field
          if (data.detectedAlerts) {
            setLibraries(data.detectedLibraries);
            setAlerts(data.detectedAlerts);
          } else {
            // If not, filter libraries vs alerts from the combined array
            const libs = [];
            const alertItems = [];
            
            data.detectedLibraries.forEach(item => {
              // Check if this is an alert (by name or other indicator)
              if (item.name && (
                  item.name.toLowerCase().includes('alert') || 
                  (item.line && item.line.toLowerCase().includes('alert('))
                )) {
                alertItems.push(item);
              } else {
                libs.push(item);
              }
            });
            
            setLibraries(libs);
            setAlerts(alertItems);
          }
        }
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('Unable to load the report. It may have expired or been removed.');
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  const toggleExpand = (itemName) => {
    setExpanded((prev) => ({ ...prev, [itemName]: !prev[itemName] }));
  };

  const getLanguage = (libName, code) => {
    if (libName && libName.toLowerCase().includes('alert')) return 'javascript';
    if (code && code.toLowerCase().includes('alert(')) return 'javascript';
    if (libName && libName.toLowerCase().includes('webgl')) return 'javascript';
    if (libName && libName.toLowerCase().includes('javascript')) return 'javascript';
    return 'html';
  };

  // For debugging - log what we have
  useEffect(() => {
    if (report) {
      console.log("Report data:", report);
      console.log("Libraries:", libraries);
      console.log("Alerts:", alerts);
    }
  }, [report, libraries, alerts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e6e9ef] dark:bg-[#1e1e2e] flex items-center justify-center">
        <p className="text-[#4c4f69] dark:text-[#cdd6f4]">Loading report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#e6e9ef] dark:bg-[#1e1e2e] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-[#d20f39] dark:text-[#f38ba8] text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get items for the active tab
  const activeItems = activeTab === 'libraries' ? libraries : alerts;

  return (
    <div className="min-h-screen bg-[#e6e9ef] dark:bg-[#1e1e2e] flex items-center justify-center">
      {report && (
        <Card className="w-full max-w-md bg-[#eff1f5] dark:bg-[#181825] border-[#9ca0b0] dark:border-[#313244]">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              External Resource Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Information Box */}
              <div className="bg-[#e6e9ef] dark:bg-[#313244] p-4 rounded-md text-[#4c4f69] dark:text-[#cdd6f4]">
                <p><strong>OS:</strong> {getFriendlyOSName(report.osName)}</p>
                <p className="flex">
                  <strong className="flex-shrink-0">URL:</strong>{' '}
                  <a
                    href={report.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1e66f5] dark:text-[#89b4fa] underline truncate ml-1"
                    title={report.url}
                  >
                    {report.url}
                  </a>
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex rounded-lg overflow-hidden">
                <button
                  className={`flex-1 py-3 px-4 ${
                    activeTab === 'libraries'
                      ? 'bg-[#89b4fa] text-white font-medium'
                      : 'bg-[#313244] text-[#cdd6f4]'
                  }`}
                  onClick={() => setActiveTab('libraries')}
                >
                  Libraries ({libraries.length})
                </button>
                <button
                  className={`flex-1 py-3 px-4 ${
                    activeTab === 'alerts'
                      ? 'bg-[#ef9f76] text-white font-medium'
                      : 'bg-[#313244] text-[#cdd6f4]'
                  }`}
                  onClick={() => setActiveTab('alerts')}
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
              
              {/* No items message */}
              {activeItems.length === 0 && (
                <div className="text-center text-[#d20f39] dark:text-[#f38ba8] mt-4 flex items-center justify-center">
                  <em-emoji shortcodes=":x:" set="apple" size="1em"></em-emoji>
                  <span className="ml-2 mt-1">
                    No {activeTab === 'libraries' ? 'external libraries' : 'JavaScript alerts'} detected
                  </span>
                </div>
              )}
              
              {/* Detected Items - For Libraries */}
              {activeTab === 'libraries' && activeItems.map((item, index) => (
                <Card key={index} className="mt-4">
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className="w-full text-left"
                  >
                    <CardContent className="flex justify-between items-center p-4 text-[#4c4f69] dark:text-[#cdd6f4] font-bold hover:bg-[#e6e9ef] dark:hover:bg-[#313244] cursor-pointer">
                      <div className="flex items-center">
                        <span className="text-[#40a02b] dark:text-[#a6e3a1]">
                          <em-emoji shortcodes=":white_check_mark:" set="apple"></em-emoji>
                        </span>
                        <span className="ml-2 mt-1 capitalize">{item.name}</span>
                      </div>
                      <span className="transition-transform duration-300"
                            style={{ transform: expanded[item.name] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        ▼
                      </span>
                    </CardContent>
                  </button>
                  <div className={`transition-all duration-300 ease-in-out ${(item.detected || item.deteted) && expanded[item.name] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                    <div className="bg-[#313244] dark:bg-[#11111b] p-2 rounded-b-lg">
                      <SyntaxHighlighter
                        language={getLanguage(item.name, item.line)}
                        style={dracula}
                        customStyle={{
                          backgroundColor: 'transparent',
                          paddingTop: '1em',
                          paddingBottom: '1em',
                          fontSize: '0.875rem'
                        }}
                      >
                        {item.line}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Detected Items - For Alerts */}
              {activeTab === 'alerts' && activeItems.map((item, index) => (
                <Card key={index} className="mt-4">
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className="w-full text-left"
                  >
                    <CardContent className="flex justify-between items-center p-4 text-[#4c4f69] dark:text-[#cdd6f4] font-bold hover:bg-[#e6e9ef] dark:hover:bg-[#313244] cursor-pointer">
                      <div className="flex items-center">
                        <span className="text-[#f38ba8]">
                          <em-emoji shortcodes=":warning:" set="apple"></em-emoji>
                        </span>
                        <span className="ml-2 mt-1 capitalize">{item.name}</span>
                      </div>
                      <span className="transition-transform duration-300"
                            style={{ transform: expanded[item.name] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        ▼
                      </span>
                    </CardContent>
                  </button>
                  <div className={`transition-all duration-300 ease-in-out ${(item.detected || item.deteted) && expanded[item.name] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                    <div className="bg-[#313244] dark:bg-[#11111b] p-2 rounded-b-lg">
                      <SyntaxHighlighter
                        language={getLanguage(item.name, item.line)}
                        style={dracula}
                        customStyle={{
                          backgroundColor: 'transparent',
                          paddingTop: '1em',
                          paddingBottom: '1em',
                          fontSize: '0.875rem'
                        }}
                      >
                        {item.line}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <Footer />
    </div>
  );
};

export default ReportPage;
