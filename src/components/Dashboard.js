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

init({data});

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
      `/.netlify/functions/fetch-url?url=${encodeURIComponent(url)}`,
    );
    
    if (!res.ok) {
      throw new Error("ERROR_FETCHING_URL");
    }
    
    return await res.text();
  };

  const handleError = (error) => {
    if (error.message === "CORS_ERROR" || error.message === "INVALID_RESPONSE") {
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
    setSearched(false);

    if (!url.trim() || !isValidURL(url)) {
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    try {
      // Fetch the HTML content using your Netlify function
      const html = await fetchUrlContent(url);
      
      // Process the HTML content using your analyzer
      const { 
        detectedLibraries, 
        detectedAlerts, 
        detectedAriaLabels,
        detectedLazyLoading,
        detectedFavicon,
        detectedFormValidation
      } = analyzeWebsite(html, libraryRules);
      
      setLibraries(detectedLibraries);
      setAlerts(detectedAlerts);
      setAriaLabels(detectedAriaLabels || []);
      setLazyLoadedElements(detectedLazyLoading || []);
      setFavicon(detectedFavicon || { exists: false, icons: [] });
      setFormValidation(detectedFormValidation || { forms: [] });
      setSearched(true);
    } catch (e) {
      console.error(e);
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#dce0e8] dark:bg-[#1a1b26] flex flex-col">
      {/* Header - URL input and verify button */}
      <DashboardHeader 
        url={url}
        setUrl={setUrl}
        handleVerify={handleVerify}
        loading={loading}
        error={error}
      />
      
      {/* Main Content */}
      <main className="mx-auto w-4/5 max-w-5xl pb-16">         
          {searched && !loading && (
            <ResultsContainer 
              libraries={libraries}
              alerts={alerts}
              ariaLabels={ariaLabels}
              lazyLoadedElements={lazyLoadedElements}
              favicon={favicon}
              formValidation={formValidation}
            />
          )}
      </main>
      
      <Footer />
      <HelpModal onSubmitUrl={handleVerify} theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
};
export default Dashboard;