import React from "react";
import { Input } from "./input";
import { Button } from "./button";

const DashboardHeader = ({ 
  url, 
  setUrl, 
  handleVerify, 
  loading, 
  error 
}) => {
  return (
    <div className="w-full transition-all duration-700 ease-in-out">
      <div className="mx-auto w-4/5 max-w-5xl">
        <h1 className="text-[#343b58] dark:text-[#c0caf5] text-2xl font-bold mb-2">External Resource Checker</h1>
        <p className="text-sm text-[#6c6e75] dark:text-[#9aa5ce] mb-4">Analyze websites for external resources and potential issues</p>
        
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Enter a URL to check"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow"
          />
          <Button
            onClick={handleVerify}
            disabled={loading}
            className="whitespace-nowrap"
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </div>
        
        {error && (
          <p className="text-[#8c4351] dark:text-[#f7768e] mt-2 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;