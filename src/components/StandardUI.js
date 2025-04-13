import React, { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import ExpandableCard from "../components/ui/ExpandableCard.js";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaShareAlt } from "react-icons/fa"; // Using react-icons for Font Awesome
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import Footer from "../components/ui/footer";
import HelpModal from "../components/HelpModal.js";
import EmptyState from "../components/ui/EmptyState.js";
import { client } from "../lib/sanity.js";
import TabUI from "../components/TabUI"; // Import TabUI component
import CopyNotification from "../components/ui/CopyNotification.js";

init({ data });

const StandardUI = () => {
  const [url, setUrl] = useState("");
  const [libraries, setLibraries] = useState([]);
  const [alerts, setAlerts] = useState([]); // Add state for JS alerts
  const [error, setError] = useState("");
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
        }`;
        const rules = await client.fetch(query);
        setLibraryRules(rules);
      } catch (err) {
        console.error("Error fetch library rules: ", err);
        setError("Error loading library detection rules.");
      }
    };

    fetchLibraryRules();
  }, []);

  const isValidURL = (input) => {
    try {
      new URL(input);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Function to detect JavaScript alerts in HTML content
  const detectJsAlerts = (html) => {
    const alertRegex = /alert\s*\([^)]*\)/g;
    const matches = html.match(alertRegex);

    if (matches) {
      return matches.map((match, index) => ({
        id: index,
        name: `JavaScript Alert #${index + 1}`,
        code: match,
      }));
    }
    return [];
  };

  const handleVerify = async () => {
    setError("");
    setLibraries([]);
    setAlerts([]);
    setExpanded({});
    setSearched(false);
    setCopied(false);

    if (!isValidURL(url)) {
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/.netlify/functions/fetch-url?url=${encodeURIComponent(url)}`,
      );
      if (!res.ok) {
        throw new Error("ERROR_FETCHING_URL");
      }
      const html = await res.text();

      // Detect libraries
      const detected = libraryRules.reduce((acc, rule) => {
        const { displayName, keywords, syntaxHighlightType } = rule;
        // Split the HTML into lines and check if any keyword appears in a line
        const lines = html
          .split("\n")
          .filter((line) =>
            keywords.some((keyword) =>
              line.toLowerCase().includes(keyword.toLowerCase()),
            ),
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

      // Detect JS alerts
      const detectedAlerts = detectJsAlerts(html);

      setLibraries(detected);
      setAlerts(detectedAlerts);
      setSearched(true);
    } catch (e) {
      console.error(e);
      if (e.message === "CORS_ERROR" || e.message === "INVALID_RESPONSE") {
        setError("Unable to scrape website data. Please try again later.");
      } else {
        setError("There was an error fetching or processing the provided URL.");
      }
      setSearched(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (itemName) => {
    setExpanded((prev) => ({ ...prev, [itemName]: !prev[itemName] }));
  };

  const handleShare = async () => {
    const payload = {
      url,
      detectedLibraries: libraries.map((lib) => ({
        name: lib.name,
        detected: true,
        line: lib.lines.join("\n"),
      })),
      detectedAlerts: alerts.map((alert) => ({
        name: alert.name,
        detected: true,
        line: alert.code,
      })),
      osName: navigator.platform,
    };

    try {
      setLoading(true); // Show loading state while saving
      const response = await fetch("/.netlify/functions/save-report", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save report");
      }

      const data = await response.json();
      await navigator.clipboard.writeText(data.shareUrl);
      setCopied(true);
    } catch (err) {
      console.error("Failed to save or copy: ", err);
      setError("Failed to create share link. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // Hide the copied message after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Determine if we should show TabUI (only when alerts are present)
  const shouldShowTabUI = alerts.length > 0;

  return (
    <div className="min-h-screen bg-[#e6e9ef] dark:bg-[#1e1e2e] flex flex-col items-center justify-center">
      <CopyNotification visible={copied} />
      <Card>
        <CardHeader>
          <CardTitle>External Resource Checker</CardTitle>
          <p className="text-center text-sm mb-4 text-[#5c5f77] dark:text-[#bac2de]">
            Enter a URL to verify whether it uses certain external resources or
            contains JavaScript alerts.
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
              {(libraries.length > 0 || alerts.length > 0) && (
                <button onClick={handleShare} title="Share Results">
                  <FaShareAlt />
                </button>
              )}
            </div>
            {error && (
              <p className="text-[#d20f39] dark:text-[#f38ba8] text-sm">
                {error}
              </p>
            )}
            <Button
              onClick={handleVerify}
              className="w-full text-slate-50"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>

            {/* Show TabUI only when we have alerts */}
            {shouldShowTabUI ? (
              <TabUI
                libraries={libraries}
                alerts={alerts}
                expanded={expanded}
                toggleExpand={toggleExpand}
                handleShare={handleShare}
                copyStatus={copied}
              />
            ) : (
              <>
                {!loading &&
                  searched &&
                  libraries.length === 0 &&
                  alerts.length === 0 &&
                  !error && <EmptyState />}

                {/* Display libraries in StandardUI */}
                {libraries.map((lib, index) => {
                  const cleanedLines = lib.lines
                    .map((line) => line.trimStart())
                    .join("\n");

                  return (
                    <ExpandableCard
                      key={index}
                      itemName={lib.name}
                      displayName={lib.name}
                      content={cleanedLines}
                      expanded={expanded}
                      toggleExpand={toggleExpand}
                      language={lib.syntaxHighlightType}
                    />
                  );
                })}
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <Footer />
      <HelpModal onSubmitUrl={handleVerify} />
    </div>
  );
};

export default StandardUI;
