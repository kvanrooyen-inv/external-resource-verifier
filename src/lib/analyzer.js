// Utility functions for analyzing website content

/**
 * Analyze website HTML content for libraries and alerts
 * @param {string} html - The HTML content of the website
 * @param {Array} libraryRules - The library detection rules from Sanity
 * @returns {Object} - Object containing detected libraries and alerts
 */
export const analyzeWebsite = (html, libraryRules) => {
  const detectedLibraries = detectLibraries(html, libraryRules);
  const detectedAlerts = detectJsAlerts(html);
  
  return {
    detectedLibraries,
    detectedAlerts
  };
};

/**
 * Detect libraries in HTML content based on library rules
 * @param {string} html - The HTML content
 * @param {Array} libraryRules - The library detection rules
 * @returns {Array} - Array of detected libraries
 */
export const detectLibraries = (html, libraryRules) => {
  return libraryRules.reduce((acc, rule) => {
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
        count: lines.length
      });
    }
    
    return acc;
  }, []);
};

/**
 * Detect JavaScript alerts in HTML content
 * @param {string} html - The HTML content
 * @returns {Array} - Array of detected alerts
 */
export const detectJsAlerts = (html) => {
  const alertRegex = /alert\s*\([^)]*\)/g;
  const matches = html.match(alertRegex);

  if (matches) {
    return matches.map((match, index) => ({
      id: index,
      name: `JavaScript Alert #${index + 1}`,
      code: match,
      count: 1
    }));
  }
  
  return [];
};
