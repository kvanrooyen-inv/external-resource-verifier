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
    <header className="bg-[#1e1e2e] py-6 w-full">
      <div className="mx-auto w-4/5 max-w-5xl">
        <h1 className="text-2xl font-bold text-white mb-2">External Resource Checker</h1>
        <p className="text-sm text-[#bac2de] mb-4">Analyze websites for external resources and potential issues</p>
        
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
          <p className="text-[#f38ba8] mt-2 text-sm">{error}</p>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
