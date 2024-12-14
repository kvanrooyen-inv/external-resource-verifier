// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load saved theme from localStorage
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    themeToggle.checked = true;
  }
}

// Toggle theme
function toggleTheme() {
  body.classList.toggle('dark-theme');
  
  // Save theme preference
  const isDarkTheme = body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

// Event listener for theme toggle
themeToggle.addEventListener('change', toggleTheme);

// Load theme on page load
loadTheme();

// Library Detection Logic
document.getElementById('check').addEventListener('click', async () => {
  const url = document.getElementById('url').value;
  const library = document.getElementById('library').value;
  const resultsDiv = document.getElementById('results');

  // Reset results
  resultsDiv.textContent = 'Checking...';
  resultsDiv.className = 'results';

  // Basic URL validation
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    resultsDiv.textContent = 'Please enter a valid URL starting with http:// or https://';
    resultsDiv.classList.add('error');
    return;
  }

  try {
    // Using a fetch request without proxy to avoid CORS issues
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    
    // Check if request was successful
    if (!data.contents) {
      throw new Error('Could not retrieve page contents');
    }

    const html = data.contents;

    // Library detection functions
    const detectionMethods = {
      bootstrap: (html) => 
        html.includes('bootstrap.css') || 
        html.includes('bootstrap.min.css') ||
        html.includes('cdn.jsdelivr.net/npm/bootstrap'),

      vue: (html) => 
        html.includes('vue.js') || 
        html.includes('vue.min.js') || 
        html.includes('Vue.js') ||
        html.includes('vue-router') ||
        html.includes('vuex') ||
        html.includes('vue.global.js'),

      react: (html) => 
        html.includes('react.js') ||
        html.includes('react.production.min.js') ||
        html.includes('react.development.js') ||
        html.includes('react-dom.development.js') ||
        html.includes('react-dom.js'),

      tailwind: (html) => 
        html.includes('tailwind.css') ||
        html.includes('tailwindcss') ||
        html.includes('cdn.tailwindcss.com'),

      jquery: (html) => 
        html.includes('jquery.js') ||
        html.includes('jquery.min.js'),

      angular: (html) => 
        html.includes('angular.js') ||
        html.includes('angular.min.js') ||
        html.includes('@angular/core'),

      fontAwesome: (html) => 
        html.includes('font-awesome') ||
        html.includes('fontawesome') ||
        html.includes('fa-')
    };

    // Perform detection
    const result = detectionMethods[library](html.toLowerCase());

    if (result) {
      resultsDiv.textContent = `✅ ${library} detected on ${url}`;
      resultsDiv.classList.add('success');
    } else {
      resultsDiv.textContent = `❌ ${library} not detected on ${url}`;
      resultsDiv.classList.add('error');
    }

  } catch (error) {
    console.error('Detection error:', error);
    resultsDiv.textContent = `Error checking library: ${error.message}`;
    resultsDiv.classList.add('error');
  }
});
