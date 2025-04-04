import React from 'react';
import ThemeToggle from './components/ThemeToggle';
import StandardUI from './components/StandardUI';
import ShareUI from './components/ShareUI';
import NotificationSystem from './components/NotificationSystem.js';
import { decompressFromEncodedURIComponent } from 'lz-string';

function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const shareParam = searchParams.get('share');

  if (shareParam) {
    const decompressed = decompressFromEncodedURIComponent(shareParam);
    if (!decompressed) {
      return (
        <div className="min-h-screen bg-background-color text-text-color">
          <ThemeToggle />
          <NotificationSystem />
          <div className="flex items-center justify-center h-full">
            <p>Error decoding share data. The link may be invalid.</p>
          </div>
        </div>
      );
    }

    const { url, detectedLibraries } = JSON.parse(decompressed);
    return (
      <div className="min-h-screen bg-background-color text-text-color">
        <ThemeToggle />
        <NotificationSystem />
        <ShareUI url={url} detectedLibraries={detectedLibraries} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-color text-text-color">
      <ThemeToggle />
      <NotificationSystem />
      <StandardUI />
    </div>
  );
}

export default App;
