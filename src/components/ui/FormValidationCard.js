import React, { useState } from "react";
import { FiChevronDown, FiChevronRight, FiCheckSquare } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const FormValidationCard = ({ formValidation = { forms: [] } }) => {
  const [expanded, setExpanded] = useState(false);
  
  const forms = formValidation.forms || [];
  
  return (
    <div className="bg-[#e6e7ed] dark:bg-[#414868] rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <span className="mr-3 text-[#2959aa] dark:text-[#7aa2f7]">
            <FiCheckSquare />
          </span>
          <span className="text-[#343b58] dark:text-[#e6e7ed] font-semibold">Form Validation</span>
        </div>
        <div className="flex items-center">
          <span className="bg-[#6c6e75] dark:bg-[#1a1b26] text-[#e6e7ed] dark:text-[#c0caf5] px-2 py-1 rounded-full text-xs mr-3 font-semibold">
            {forms.length}
          </span>
          {expanded ? (
            <FiChevronDown className="text-[#343b58] dark:text-[#9aa5ce]" />
          ) : (
            <FiChevronRight className="text-[#343b58] dark:text-[#9aa5ce]" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <>
          {/* Content Display */}
          <div className="max-h-96 overflow-y-auto">
            {forms.length > 0 ? (
              <FormValidationList forms={forms} />
            ) : (
              <div className="px-4 py-3 text-[#343b58] dark:text-[#e6e7ed]">
                No forms with validation found on this page.
              </div>
            )}
          </div>
          
          {/* Summary Footer */}
          <div className="px-4 py-2 border-t border-[#c9cacf] dark:border-[#343b58] text-sm text-[#343b58] dark:text-[#9aa5ce]">
            {forms.length} form{forms.length !== 1 ? 's' : ''} found
          </div>
        </>
      )}
    </div>
  );
};

// Form Validation List Component
const FormValidationList = ({ forms }) => {
  return (
    <div>
      {forms.map(form => (
        <FormValidationItem key={form.id} form={form} />
      ))}
    </div>
  );
};

// Individual Form Validation Item Component
const FormValidationItem = ({ form }) => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  
  // Set badge color based on validation type
  let badgeColor = "bg-[#6c6e75] dark:bg-[#1a1b26] text-[#e6e7ed] dark:text-[#c0caf5]";
  
  if (form.validationType === 'html5') {
    badgeColor = "bg-[#2e5916] dark:bg-[#9ece6a] text-white dark:text-[#1a1b26]";
  } else if (form.validationType === 'custom') {
    badgeColor = "bg-[#7e3992] dark:bg-[#bb9af7] text-white dark:text-[#1a1b26]";
  }
  
  return (
    <div className="border-t border-[#c9cacf] dark:border-[#343b58]">
      <div
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#d1d5e3] dark:hover:bg-[#363b54]"
        onClick={() => setDetailsExpanded(!detailsExpanded)}
      >
        <div className="flex-grow">
          <div className="flex items-center">
            <span className="text-[#343b58] dark:text-[#e6e7ed] font-medium">
              Form
            </span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${badgeColor}`}>
              {form.validationType === 'html5' ? 'HTML5 Validation' : 
               form.validationType === 'custom' ? 'Custom Validation' : 
               'No Validation'}
            </span>
          </div>
          <div className="text-xs text-[#6c6e75] dark:text-[#9aa5ce] mt-1">
            {form.validationElements.length > 0 ? 
              `${form.validationElements.length} validated elements` : 
              "No validation attributes found"}
          </div>
          <div className="text-xs text-[#6c6e75] dark:text-[#9aa5ce]">
            Line {form.lineNumber}
          </div>
        </div>
        <div className="flex items-center ml-2">
          {detailsExpanded ? (
            <FiChevronDown className="text-[#343b58] dark:text-[#9aa5ce]" />
          ) : (
            <FiChevronRight className="text-[#343b58] dark:text-[#9aa5ce]" />
          )}
        </div>
      </div>

      {detailsExpanded && (
        <div className="bg-[#343b58] dark:bg-[#24283b] p-2">
          <SyntaxHighlighter
            language="html"
            style={dracula}
            customStyle={{
              backgroundColor: "transparent",
              paddingTop: "1em",
              paddingBottom: "1em",
              fontSize: "0.875rem",
            }}
          >
            {form.fullElement || form.element}
          </SyntaxHighlighter>
          
          {form.validationElements.length > 0 && (
            <div className="mt-2 mb-1 text-[#e6e7ed] font-medium text-sm">
              Validation Elements:
            </div>
          )}
          
          {form.validationElements.map((validElement, index) => (
            <div key={index} className="mb-2 pl-2 border-l-2 border-[#7e3992] dark:border-[#bb9af7]">
              <div className="text-xs text-[#9aa5ce] mb-1">
                Line {validElement.lineNumber} - {validElement.type === 'custom-js' ? 'Custom JS Validation' : 'HTML5 Validation'}
              </div>
              <SyntaxHighlighter
                language="html"
                style={dracula}
                customStyle={{
                  backgroundColor: "transparent",
                  padding: "0.5em",
                  fontSize: "0.8rem",
                  margin: 0
                }}
              >
                {validElement.element}
              </SyntaxHighlighter>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormValidationCard;