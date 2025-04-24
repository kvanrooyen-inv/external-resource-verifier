// Utility functions for analyzing website content

/**
 * Analyze website HTML content for libraries, alerts, ARIA labels, lazy loading, favicon, and form validation
 * @param {string} html - The HTML content of the website
 * @param {Array} libraryRules - The library detection rules from Sanity
 * @returns {Object} - Object containing all detected elements
 */
export const analyzeWebsite = (html, libraryRules) => {
  const detectedLibraries = detectLibraries(html, libraryRules);
  const detectedAlerts = detectJsAlerts(html);
  const detectedAriaLabels = detectAriaLabels(html);
  const detectedLazyLoading = detectLazyLoading(html);
  const detectedFavicon = detectFavicon(html);
  const detectedFormValidation = detectFormValidation(html);
  
  return {
    detectedLibraries,
    detectedAlerts,
    detectedAriaLabels,
    detectedLazyLoading,
    detectedFavicon,
    detectedFormValidation
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

/**
 * Detect ARIA labels and attributes in HTML content
 * @param {string} html - The HTML content
 * @returns {Array} - Array of detected ARIA labels and attributes
 */
export const detectAriaLabels = (html) => {
  const ariaAttributes = [
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
    'aria-description',
    'aria-hidden',
    'aria-live',
    'aria-expanded',
    'aria-controls',
    'aria-selected',
    'aria-required',
    'aria-checked',
    'aria-pressed',
    'aria-current',
    'aria-disabled',
    'aria-invalid',
    'aria-haspopup',
    'role' // Including 'role' as it's a key accessibility attribute
  ];
  
  const lines = html.split('\n');
  const detectedAttributes = [];
  
  lines.forEach((line, lineIndex) => {
    ariaAttributes.forEach(attribute => {
      // Case insensitive search for aria attributes
      const regex = new RegExp(`\\s${attribute}\\s*=\\s*["']([^"']*)["']`, 'i');
      const match = line.match(regex);
      
      if (match) {
        const element = line.trim();
        const elementType = element.match(/<([a-z][a-z0-9]*)/i)?.[1] || 'unknown';
        
        detectedAttributes.push({
          id: detectedAttributes.length,
          attribute: attribute,
          value: match[1],
          element: element,
          elementType: elementType,
          lineNumber: lineIndex + 1,
          name: `${elementType} with ${attribute}="${match[1]}"`
        });
      }
    });
  });
  
  return detectedAttributes;
};

/**
 * Detect lazy loading usage in HTML content
 * @param {string} html - The HTML content
 * @returns {Array} - Array of detected lazy loaded elements
 */
export const detectLazyLoading = (html) => {
  const lazyLoaded = [];
  
  // Modified regex patterns with more flexibility
  const lazyLoadingRegex = /loading\s*=\s*["']lazy["']/i;
  const dataSrcRegex = /data-src\s*=\s*["'][^"']*["']/i;
  const intersectionObserverRegex = /IntersectionObserver/i;
  
  // First try to find all image, iframe, or video tags
  const elementRegex = /<(img|iframe|video)([^>]*)>/gi;
  let elementMatch;
  
  while ((elementMatch = elementRegex.exec(html)) !== null) {
    const fullTag = elementMatch[0];
    const elementType = elementMatch[1];
    const attributes = elementMatch[2];
    
    // Check if this element has lazy loading
    if (lazyLoadingRegex.test(attributes)) {
      lazyLoaded.push({
        id: lazyLoaded.length,
        type: 'native',
        element: fullTag.trim(),
        elementType: elementType,
        lineNumber: getLineNumber(html, elementMatch.index),
        name: `Native lazy loading for <${elementType}>`
      });
    }
    
    // Check for data-src attribute
    if (dataSrcRegex.test(attributes)) {
      lazyLoaded.push({
        id: lazyLoaded.length,
        type: 'data-src',
        element: fullTag.trim(),
        elementType: elementType,
        lineNumber: getLineNumber(html, elementMatch.index),
        name: `data-src lazy loading for <${elementType}>`
      });
    }
  }
  
  // Check for IntersectionObserver usage separately
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  
  while ((scriptMatch = scriptRegex.exec(html)) !== null) {
    const scriptContent = scriptMatch[1];
    
    if (intersectionObserverRegex.test(scriptContent)) {
      lazyLoaded.push({
        id: lazyLoaded.length,
        type: 'intersection-observer',
        element: scriptMatch[0].substring(0, 100) + '...',  // First 100 chars for brevity
        elementType: 'script',
        lineNumber: getLineNumber(html, scriptMatch.index),
        name: 'IntersectionObserver lazy loading'
      });
    }
  }
  
  return lazyLoaded;
};

// Helper function to get line number from character index
function getLineNumber(html, index) {
  const linesUntilIndex = html.substring(0, index).split('\n');
  return linesUntilIndex.length;
}

/**
 * Detect favicon information in HTML content
 * @param {string} html - The HTML content
 * @returns {Object} - Object containing favicon information
 */
export const detectFavicon = (html) => {
  const faviconInfo = {
    exists: false,
    icons: []
  };
  
  const lines = html.split('\n');
  
  // Regular favicon
  const faviconRegex = /<link[^>]*rel\s*=\s*["'](?:shortcut )?icon["'][^>]*href\s*=\s*["']([^"']*)["'][^>]*>/i;
  
  lines.forEach((line, lineIndex) => {
    // Check for standard favicon
    const faviconMatch = line.match(faviconRegex);
    if (faviconMatch) {
      faviconInfo.exists = true;
      faviconInfo.icons.push({
        id: faviconInfo.icons.length,
        type: 'favicon',
        href: faviconMatch[1],
        element: line.trim(),
        lineNumber: lineIndex + 1,
        name: 'Standard Favicon'
      });
    }
  });
  
  return faviconInfo;
};

/**
 * Detect form validation in HTML content
 * @param {string} html - The HTML content
 * @returns {Object} - Object containing form validation information
 */
export const detectFormValidation = (html) => {
  const formValidation = {
    forms: []
  };
  
  const lines = html.split('\n');
  let currentForm = null;
  let formLineStart = -1;
  
  // Iterate through each line to find forms and their validation attributes
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for form start
    if (line.match(/<form[^>]*>/i) && !currentForm) {
      const novalidateMatch = line.match(/novalidate/i);
      currentForm = {
        id: formValidation.forms.length,
        hasCustomValidation: novalidateMatch !== null,
        validationElements: [],
        element: line.trim(),
        lineNumber: i + 1
      };
      formLineStart = i;
    }
    
    // If we're inside a form, check for validation attributes
    if (currentForm) {
      // Check for validation attributes
      const requiredMatch = line.match(/<[^>]*\srequired[^>]*>/i);
      const patternMatch = line.match(/<[^>]*\spattern\s*=\s*["'][^"']*["'][^>]*>/i);
      const minlengthMatch = line.match(/<[^>]*\sminlength\s*=\s*["'][^"']*["'][^>]*>/i);
      const maxlengthMatch = line.match(/<[^>]*\smaxlength\s*=\s*["'][^"']*["'][^>]*>/i);
      const minMatch = line.match(/<[^>]*\smin\s*=\s*["'][^"']*["'][^>]*>/i);
      const maxMatch = line.match(/<[^>]*\smax\s*=\s*["'][^"']*["'][^>]*>/i);
      
      // Check for JavaScript validation
      const onInvalidMatch = line.match(/<[^>]*\soninvalid\s*=\s*["'][^"']*["'][^>]*>/i);
      const onSubmitMatch = line.match(/<form[^>]*\sonsubmit\s*=\s*["'][^"']*["'][^>]*>/i);
      
      if (requiredMatch || patternMatch || minlengthMatch || maxlengthMatch || minMatch || maxMatch || onInvalidMatch) {
        let validationType = 'standard';
        if (onInvalidMatch) validationType = 'custom-js';
        
        currentForm.validationElements.push({
          element: line.trim(),
          lineNumber: i + 1,
          type: validationType
        });
      }
      
      if (onSubmitMatch) {
        currentForm.hasCustomValidation = true;
      }
      
      // Check for form end
      if (line.match(/<\/form>/i)) {
        // Get the complete form by joining lines
        currentForm.fullElement = lines.slice(formLineStart, i + 1).join('\n');
        
        // Determine if it's using HTML5 validation or custom validation
        if (currentForm.validationElements.length > 0 && !currentForm.hasCustomValidation) {
          currentForm.validationType = 'html5';
          currentForm.name = 'HTML5 Form Validation';
        } else if (currentForm.hasCustomValidation) {
          currentForm.validationType = 'custom';
          currentForm.name = 'Custom Form Validation';
        } else {
          currentForm.validationType = 'none';
          currentForm.name = 'No Form Validation';
        }
        
        formValidation.forms.push(currentForm);
        currentForm = null;
        formLineStart = -1;
      }
    }
  }
  
  return formValidation;
};