import React from "react";
import ResourcesCard from "./ResourcesCard";
import AlertsCard from "./AlertsCard";
import AriaLabelsCard from "./AriaLabelsCard";
import LazyLoadingCard from "./LazyLoadingCard";
import FaviconCard from "./FaviconCard";
import FormValidationCard from "./FormValidationCard";
import EmptyState from "./EmptyState";
import MetaTagCard from "./MetaTagsCard";
import SemanticHTMLCard from "./SemanticHTMLCard";

const ResultsContainer = ({
  libraries,
  alerts,
  ariaLabels,
  lazyLoadedElements,
  favicon,
  formValidation,
  metaTags,
  semanticElements,
  semanticScore
}) => {
  // Debugging purposes.
  console.log("ResultsContainer rendering with semantic elements:", semanticElements?.length);
  console.log("Semantic score:", semanticScore);
  
  const hasResults =
    libraries.length > 0 ||
    alerts.length > 0 ||
    ariaLabels.length > 0 ||
    (lazyLoadedElements && lazyLoadedElements.length > 0) ||
    (favicon && favicon.exists) ||
    (formValidation && formValidation.forms.length > 0) ||
    metaTags.length > 0 ||
    (semanticElements && semanticElements.length > 0);

  if (!hasResults) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-[#343b58] dark:text-[#c0caf5] text-xl font-medium mb-2 mt-2">
        Results
      </h2>

      {/* External Resources Section */}
      {libraries.length > 0 && <ResourcesCard libraries={libraries} />}

      {/* JavaScript Alerts Section */}
      {alerts.length > 0 && <AlertsCard alerts={alerts} />}

      {/* ARIA Labels Section */}
      {ariaLabels.length > 0 && <AriaLabelsCard ariaLabels={ariaLabels} />}

      {/* Lazy Loading Section */}
      {lazyLoadedElements && lazyLoadedElements.length > 0 && (
        <LazyLoadingCard lazyLoadedElements={lazyLoadedElements} />
      )}

      {/* Favicon Section */}
      {favicon && <FaviconCard favicon={favicon} />}

      {/* Form Validation Section */}
      {formValidation && formValidation.forms.length > 0 && (
        <FormValidationCard formValidation={formValidation} />
      )}

      {/* Meta Tags Section */}
      {metaTags && metaTags.length > 0 && <MetaTagCard metaTags={metaTags} />}

      {/* Semantic HTML Section */}
      {semanticElements && semanticElements.length > 0 && (
        <SemanticHTMLCard 
          semanticElements={semanticElements} 
          semanticScore={semanticScore}
        />
      )}
    </div>
  );
};

export default ResultsContainer;
