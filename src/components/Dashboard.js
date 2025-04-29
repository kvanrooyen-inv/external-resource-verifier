import React, { useState, useEffect, useContext } from "react";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import DashboardHeader from "./ui/DashboardHeader";
import Footer from "./ui/footer";
import ResultsContainer from "./ui/ResultsContainer";
import { client } from "../lib/sanity";
import { analyzeWebsite } from "../lib/analyzer";
import HelpModal from "./HelpModal";
import { ThemeContext } from "../context/ThemeContext";

init({ data });

const Dashboard = () => {
  const [url, setUrl] = useState("");
  const [libraries, setLibraries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [ariaLabels, setAriaLabels] = useState([]);
  const [lazyLoadedElements, setLazyLoadedElements] = useState([]);
  const [favicon, setFavicon] = useState({ exists: false, icons: [] });
  const [formValidation, setFormValidation] = useState({ forms: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [libraryRules, setLibraryRules] = useState([]);
  const [headerPosition, setHeaderPosition] = useState("centered"); // 'centered' or 'top'
  const [metaTags, setMetaTags] = useState([]);
  const [semanticElements, setSemanticElements] = useState([]);
  const [semanticScore, setSemanticScore] = useState(null);

  const { theme, toggleTheme } = useContext(ThemeContext);

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
        console.error("Error fetching library rules: ", err);
        setError("Error loading library detection rules.");
      }
    };

    fetchLibraryRules();
  }, []);

  // Helper functions moved inside the component scope
  const isValidURL = (input) => {
    try {
      new URL(input);
      return true;
    } catch (_) {
      return false;
    }
  };

  const fetchUrlContent = async (url) => {
    const res = await fetch(
      `/.netlify/functions/fetch-url?url=${encodeURIComponent(url)}`
    );

    if (!res.ok) {
      throw new Error("ERROR_FETCHING_URL");
    }

    return await res.text();
  };

  const handleError = (error) => {
    if (
      error.message === "CORS_ERROR" ||
      error.message === "INVALID_RESPONSE"
    ) {
      setError("Unable to scrape website data. Please try again later.");
    } else {
      setError("There was an error fetching or processing the provided URL.");
    }
    setSearched(false);
  };

  const handleVerify = async () => {
    setError("");
    setLibraries([]);
    setAlerts([]);
    setAriaLabels([]);
    setLazyLoadedElements([]);
    setFavicon({ exists: false, icons: [] });
    setFormValidation({ forms: [] });
    setMetaTags([]);
    setSemanticElements([]);
    setSemanticScore(null);

    if (!url.trim() || !isValidURL(url)) {
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    try {
      // Move header up before fetching
      setHeaderPosition("top");

      // Fetch the HTML content using your Netlify function
      const html = await fetchUrlContent(url);

      // Process the HTML content using your analyzer
      // Process the HTML content using your analyzer
      console.log("Starting analysis...");
      const {
        detectedLibraries,
        detectedAlerts,
        detectedAriaLabels,
        detectedLazyLoading,
        detectedFavicon,
        detectedMetaTags,
        detectedSemanticElements,
        detectedFormValidation,
        semanticScore,
      } = analyzeWebsite(html, libraryRules);

      console.log("Analysis complete, updating state...");

      // Update state with all the analysis results
      setLibraries(detectedLibraries || []);
      setAlerts(detectedAlerts || []);
      setAriaLabels(detectedAriaLabels || []);
      setLazyLoadedElements(detectedLazyLoading || []);
      setFavicon(detectedFavicon || { exists: false, icons: [] });
      setFormValidation(detectedFormValidation || { forms: [] });
      setMetaTags(detectedMetaTags || []);
      setSemanticElements(detectedSemanticElements || []);
      setSemanticScore(semanticScore || null);
      setSearched(true);

      console.log(
        `Found ${detectedSemanticElements?.length || 0} semantic elements`
      );
      console.log("Semantic score:", semanticScore);
      // Save analysis data to Supabase
      try {
        const osName = navigator.platform || "Unknown";
        const analysisData = {
          url: url,
          detectedLibraries: detectedLibraries,
          detectedAlerts: detectedAlerts,
          detectedAriaLabels: detectedAriaLabels,
          detectedLazyLoading: detectedLazyLoading,
          detectedFormValidation: detectedFormValidation,
          osName: osName,
          detectedMetaTags: detectedMetaTags,
          detectedSemanticElements: detectedSemanticElements || [],
        };

        const response = await fetch("/.netlify/functions/save-report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(analysisData),
        });

        const result = await response.json();
        if (result.success) {
          console.log("Analysis data saved successfully");
        }
      } catch (saveError) {
        console.error("Error saving analysis data:", saveError);
        // We don't set the main error here since the analysis was successful
      }
    } catch (e) {
      console.error(e);
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#dce0e8] dark:bg-[#1a1b26] flex flex-col">
      {/* Header with dynamic position based on state */}
      <div
        className={`w-full transition-all duration-700 ease-in-out ${headerPosition === "centered" ? "flex-grow flex items-center" : ""}`}
      >
        <DashboardHeader
          url={url}
          setUrl={setUrl}
          handleVerify={handleVerify}
          loading={loading}
          error={error}
        />
      </div>

      {/* Main Content */}
      <main
        className={`mx-auto w-4/5 max-w-5xl pb-16 transition-all duration-700 ease-in-out ${headerPosition === "centered" && !searched ? "opacity-0 h-0" : "opacity-100"}`}
      >
        {searched && !loading && (
          <ResultsContainer
            libraries={libraries}
            alerts={alerts}
            ariaLabels={ariaLabels}
            lazyLoadedElements={lazyLoadedElements}
            favicon={favicon}
            formValidation={formValidation}
            metaTags={metaTags}
            semanticElements={semanticElements}
            semanticScore={semanticScore}
          />
        )}
      </main>

      <Footer />
      <HelpModal
        onSubmitUrl={handleVerify}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </div>
  );
};
export default Dashboard;
