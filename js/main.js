import ThemeService from './services/themeService.js';
import LibraryDetectionService from './services/libraryDetectionService.js';
import LibraryResultRenderer from './ui/libraryResultRenderer.js';

document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle setup
    const themeToggle = document.getElementById('theme-toggle');
    const initialTheme = ThemeService.loadTheme();
    themeToggle.checked = initialTheme === ThemeService.DARK_THEME;

    themeToggle.addEventListener('change', () => {
        ThemeService.toggleTheme();
    });

    // Library detection setup
    const checkButton = document.getElementById('check');
    const container = document.querySelector('.container');
    const resultsContainer = document.getElementById('results');

    checkButton.addEventListener('click', async () => {
        const urlInput = document.getElementById('url');
        const url = urlInput.value;

        // Reset UI
        resultsContainer.textContent = 'Checking...';
        resultsContainer.className = 'results';

        try {
            const detectedLibraries = await LibraryDetectionService.detectLibraries(url);
            LibraryResultRenderer.renderLibraryResults(url, detectedLibraries, container);
        } catch (error) {
            resultsContainer.textContent = `Error: ${error.message}`;
            resultsContainer.classList.add('error');
        }
    });
});
