// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    themeToggle.checked = true;
  }
}

function toggleTheme() {
  body.classList.toggle('dark-theme');
  const isDarkTheme = body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

themeToggle.addEventListener('change', toggleTheme);
loadTheme();

// Library Detection Logic
document.getElementById('check').addEventListener('click', async () => {
  const url = document.getElementById('url').value;
  const container = document.querySelector('.container');
  
  // Clear previous library results
  const existingLibraryResults = document.querySelectorAll('.library-result');
  existingLibraryResults.forEach(el => el.remove());

  // Reset main results container
  const mainResults = document.getElementById('results');
  mainResults.textContent = 'Checking...';
  mainResults.className = 'results';

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    mainResults.textContent = 'Please enter a valid URL starting with http:// or https://';
    mainResults.classList.add('error');
    return;
  }

  // Library detection methods (unchanged from previous version)
  const libraryDetectionMethods = {
    bootstrap: (htmlStr) => htmlStr.split('\n').filter(line =>
      line.toLowerCase().includes('bootstrap.css') ||
      line.toLowerCase().includes('bootstrap.min.css') ||
      line.toLowerCase().includes('cdn.jsdelivr.net/npm/bootstrap')
    ),
    vue: (htmlStr) => htmlStr.split('\n').filter(line =>
      line.toLowerCase().includes('vue.js') ||
      line.toLowerCase().includes('vue.min.js') ||
      line.toLowerCase().includes('vue-router') ||
      line.toLowerCase().includes('vuex') ||
      line.toLowerCase().includes('vue.global.js')
    ),
    react: (htmlStr) => htmlStr.split('\n').filter(line =>
      line.toLowerCase().includes('react.js') ||
      line.toLowerCase().includes('react.production.min.js') ||
      line.toLowerCase().includes('react.development.js') ||
      line.toLowerCase().includes('react-dom.development.js') ||
      line.toLowerCase().includes('react-dom.js')
    ),
    tailwind: (htmlStr) => htmlStr.split('\n').filter(line =>
      line.toLowerCase().includes('tailwind.css') ||
      line.toLowerCase().includes('tailwindcss') ||
      line.toLowerCase().includes('cdn.tailwindcss.com')
    ),
    jquery: (htmlStr) => htmlStr.split('\n').filter(line =>
      line.toLowerCase().includes('jquery.js') ||
      line.toLowerCase().includes('jquery.min.js')
    ),
    angular: (htmlStr) => htmlStr.split('\n').filter(line =>
      line.toLowerCase().includes('angular.js') ||
      line.toLowerCase().includes('angular.min.js') ||
      line.toLowerCase().includes('@angular/core')
    ),
    fontAwesome: (htmlStr) => htmlStr.split('\n').filter(line =>
      line.toLowerCase().includes('font-awesome') ||
      line.toLowerCase().includes('fontawesome') ||
      line.toLowerCase().includes('fa-')
    ),
    webgl: (htmlStr) => htmlStr.split('\n').filter(line =>
      line.toLowerCase().includes('webgl') ||
      line.toLowerCase().includes('three.js') ||
      line.toLowerCase().includes('babylon.js') ||
      line.toLowerCase().includes('gl-matrix.js') ||
      line.toLowerCase().includes('canvas.getcontext("webgl")')
    )
  };

  const libraryFullNames = {
    'bootstrap': 'Bootstrap',
    'vue': 'Vue.js',
    'react': 'React',
    'tailwind': 'Tailwind CSS',
    'jquery': 'jQuery',
    'angular': 'Angular',
    'fontAwesome': 'Font Awesome',
    'webgl': 'WebGL'
  };

  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (!data.contents) {
      throw new Error('Could not retrieve page contents');
    }

    const html = data.contents;
    const detectedLibraries = [];

    // Detect libraries
    for (const [libraryKey, detectionMethod] of Object.entries(libraryDetectionMethods)) {
      const result = detectionMethod(html);
      if (result && result.length > 0) {
        detectedLibraries.push({
          key: libraryKey,
          name: libraryFullNames[libraryKey],
          lines: result
        });
      }
    }

    // Hide main results if libraries are found
    if (detectedLibraries.length > 0) {
      mainResults.style.display = 'none';
    } else {
      mainResults.style.display = 'block';
      mainResults.innerHTML = `❌ <a href="${url}" target="_blank" class="not-detected">No libraries detected</a>`;
      mainResults.classList.add('error');
      return;
    }

    // Create result containers for each detected library
    detectedLibraries.forEach((library) => {
      const libraryResultContainer = document.createElement('div');
      libraryResultContainer.classList.add('library-result');

      // Library detection result
      const libraryResults = document.createElement('div');
      libraryResults.classList.add('library-detection-result');
      libraryResults.innerHTML = `✅ <a href="${url}" target="_blank" class="detected">${library.name} detected</a>`;

      // Details container
      const detailsContainer = document.createElement('div');
      detailsContainer.classList.add('library-details');
      detailsContainer.style.display = 'none';

      const detailsContent = document.createElement('pre');
      const detailsCode = document.createElement('code');
      
      // Remove leading spaces/tabs from each line
      const trimmedLines = library.lines.map(line => line.trimStart());
      detailsCode.textContent = trimmedLines.join('\n');
      detailsContent.appendChild(detailsCode);
      detailsContainer.appendChild(detailsContent);

      // Chevron toggle
      const detailsToggle = document.createElement('div');
      detailsToggle.classList.add('details-toggle');
      detailsToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';

      // Combine results and toggle
      libraryResultContainer.appendChild(libraryResults);
      libraryResultContainer.appendChild(detailsToggle);
      libraryResultContainer.appendChild(detailsContainer);

      // Highlight code
      hljs.highlightElement(detailsCode);

      // Toggle details
      detailsToggle.onclick = () => {
        if (detailsContainer.style.display === 'none') {
          detailsContainer.style.display = 'block';
          detailsToggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
        } else {
          detailsContainer.style.display = 'none';
          detailsToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
        }
      };

      // Insert after the main results container
      container.appendChild(libraryResultContainer);
    });

  } catch (error) {
    console.error('Detection error:', error);
    mainResults.style.display = 'block';
    mainResults.textContent = `Error checking libraries: ${error.message}`;
    mainResults.classList.add('error');
  }
});
