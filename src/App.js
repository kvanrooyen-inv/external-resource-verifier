import React from 'react';
import ThemeToggle from './components/ThemeToggle';
import StandardUI from './components/StandardUI';

function App() {
  return (
    <div className="min-h-screen bg-background-color text-text-color">
      <ThemeToggle />
      <StandardUI />
      {/* Uncomment and pass props when using ShareUI */}
      {/* <ShareUI 
        url="https://example.com" 
        detectedLibraries={[
          { name: 'React', detected: true, line: 'import React from "react"' }
        ]} 
      /> */}
    </div>
  );
}

export default App;
