import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import Footer from "../components/ui/footer";
import ExpandableCard from "../components/ui/ExpandableCard";
import EmptyState from "../components/ui/EmptyState";
import TabSelector from "../components/ui/TabSelector";

const ReportPage = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [libraries, setLibraries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});
  const [activeTab, setActiveTab] = useState("resources");

  // Add the switchTab function that was missing
  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  // Get friendly OS name
  const getFriendlyOSName = (osName) => {
    if (!osName) return "Unknown";

    // For Linux
    if (osName.toLowerCase().includes("linux")) {
      return "Linux";
    }

    // For Windows
    if (osName.toLowerCase().includes("windows")) {
      if (osName.includes("10")) return "Windows 10";
      if (osName.includes("11")) return "Windows 11";
      if (osName.includes("8")) return "Windows 8";
      if (osName.includes("7")) return "Windows 7";
      return "Windows";
    }

    // For macOS
    if (
      osName.toLowerCase().includes("darwin") ||
      osName.toLowerCase().includes("mac")
    ) {
      if (osName.includes("10.15")) return "macOS Catalina";
      if (osName.includes("11")) return "macOS Big Sur";
      if (osName.includes("12")) return "macOS Monterey";
      if (osName.includes("13")) return "macOS Ventura";
      if (osName.includes("14")) return "macOS Sonoma";
      return "macOS";
    }

    return osName;
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(
          `/.netlify/functions/get-report/${reportId}`,
        );
        if (!response.ok) {
          throw new Error("Report not found");
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

            data.detectedLibraries.forEach((item) => {
              // Check if this is an alert (by name or other indicator)
              if (
                item.name &&
                (item.name.toLowerCase().includes("alert") ||
                  (item.line && item.line.toLowerCase().includes("alert(")))
              ) {
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
        console.error("Error fetching report:", err);
        setError(
          "Unable to load the report. It may have expired or been removed.",
        );
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
    if (libName && libName.toLowerCase().includes("alert")) return "javascript";
    if (code && code.toLowerCase().includes("alert(")) return "javascript";
    if (libName && libName.toLowerCase().includes("webgl")) return "javascript";
    if (libName && libName.toLowerCase().includes("javascript"))
      return "javascript";
    return "html";
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
            <p className="text-[#d20f39] dark:text-[#f38ba8] text-center">
              {error}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get items for the active tab
  const activeItems = activeTab === "resources" ? libraries : alerts;

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
                <p>
                  <strong>OS:</strong> {getFriendlyOSName(report.osName)}
                </p>
                <p className="flex">
                  <strong className="flex-shrink-0">URL:</strong>
                  <a
                    href={report.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1e66f5] dark:text-[#89b4fa] underline
                    truncate ml-1"
                    title={report.url}
                  >
                    {report.url}>
                  </a>
                </p>
              </div>
              {/* Tab Navigation using TabSelector component */}
              <TabSelector
                activeTab={activeTab}
                onTabChange={switchTab}
                librariesCount={libraries.length}
                alertsCount={alerts.length}
              />

              {activeTab === "resources" && (
                <div>
                  {libraries.length === 0 ? (
                    <EmptyState message="No libraries detected" />
                  ) : (
                    libraries.map((lib, index) => {
                      // Handle case where lines might not exist
                      let content = "";

                      if (lib.lines && Array.isArray(lib.lines)) {
                        // Remove leading whitespace from each line
                        content = lib.lines
                          .map((line) => line.trimStart())
                          .join("\n");
                      } else if (lib.code) {
                        content = lib.code;
                      } else if (lib.line) {
                        content = lib.line;
                      } else {
                        content = "No content available";
                      }

                      return (
                        <ExpandableCard
                          key={index}
                          itemName={lib.name}
                          displayName={lib.name}
                          content={content}
                          expanded={expanded}
                          toggleExpand={toggleExpand}
                          language={
                            lib.syntaxHighlightType ||
                            getLanguage(lib.name, content)
                          }
                        />
                      );
                    })
                  )}
                </div>
              )}

              {/* Alerts content */}
              {activeTab === "alerts" && (
                <div>
                  {alerts.length === 0 ? (
                    <EmptyState message="No alerts detected" />
                  ) : (
                    alerts.map((alert, index) => (
                      <ExpandableCard
                        key={index}
                        itemName={`alert-${alert.id}`}
                        displayName={alert.name}
                        content={alert.code}
                        expanded={expanded}
                        toggleExpand={toggleExpand}
                        language="javascript"
                        type="alert"
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      <Footer />
    </div>
  );
};

export default ReportPage;
