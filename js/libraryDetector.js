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
  const library = document.getElementById('library').value;
  const resultsDiv = document.getElementById('results');
  const detailsToggle = document.getElementById('details-toggle');
  const detailsContainer = document.getElementById('details-container');
  const detailsContent = document.getElementById('details-content');

  // Reset state
  resultsDiv.textContent = 'Checking...';
  resultsDiv.className = 'results';
  detailsToggle.style.display = 'none';
  detailsContainer.style.display = 'none';
  detailsContent.textContent = '';

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

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    resultsDiv.textContent = 'Please enter a valid URL starting with http:// or https://';
    resultsDiv.classList.add('error');
    return;
  }

  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (!data.contents) {
      throw new Error('Could not retrieve page contents');
    }

    const html = data.contents;

    const detectionMethods = {
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

    const fullLibraryName = libraryFullNames[library] || library;
    const result = detectionMethods[library](html);

    if (result && result.length > 0) {
      resultsDiv.innerHTML = `✅ <a href="${url}" target="_blank">${fullLibraryName} detected</a>`;
      resultsDiv.classList.add('success');
      detailsToggle.style.display = 'inline-block';

      // Remove leading spaces/tabs from each line
      const trimmedLines = result.map(line => line.trimStart());
      detailsContent.textContent = trimmedLines.join('\n');

      // Automatically detect language and highlight
      hljs.highlightElement(detailsContent);

      detailsToggle.onclick = () => {
        if (detailsContainer.style.display === 'none') {
          detailsContainer.style.display = 'block';
          detailsToggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
        } else {
          detailsContainer.style.display = 'none';
          detailsToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
        }
      };
    } else {
      resultsDiv.innerHTML = `❌ <a href="${url}" target="_blank">${fullLibraryName} not detected</a>`;
      resultsDiv.classList.add('error');
    }

  } catch (error) {
    console.error('Detection error:', error);
    resultsDiv.textContent = `Error checking library: ${error.message}`;
    resultsDiv.classList.add('error');
  }
});

