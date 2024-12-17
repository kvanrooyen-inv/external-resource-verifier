import DomUtils from '../utils/domUtils.js';

class LibraryResultRenderer {
    static renderLibraryResults(url, libraries, container) {
        // Clear any previous library results
        const existingLibraryResults = container.querySelectorAll('.library-result');
        existingLibraryResults.forEach(el => el.remove());

        const mainResults = container.querySelector('#results');
        
        if (libraries.length === 0) {
            this.renderNoLibrariesFound(url, mainResults);
            return;
        }

        // Hide main results if libraries found
        DomUtils.toggleVisibility(mainResults, false);

        libraries.forEach(library => {
            const libraryResultContainer = this.createLibraryResultElement(url, library);
            container.appendChild(libraryResultContainer);
        });
    }

    static renderNoLibrariesFound(url, resultsContainer) {
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = `❌ <a href="${url}" target="_blank" class="not-detected">No libraries detected</a>`;
        resultsContainer.classList.add('error');
    }

    static createLibraryResultElement(url, library) {
        const libraryResult = DomUtils.createElement('div', ['library-result']);
        
        const detectionResult = DomUtils.createElement('div', ['library-detection-result'], 
            `✅ <a href="${url}" target="_blank" class="detected">${library.name} detected</a>`
        );

        const detailsToggle = this.createDetailsToggle(library);
        const detailsContainer = this.createDetailsContainer(library.lines);

        libraryResult.append(detectionResult, detailsToggle, detailsContainer);
        return libraryResult;
    }

    static createDetailsToggle() {
        const detailsToggle = DomUtils.createElement('div', ['details-toggle']);
        detailsToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
        
        detailsToggle.onclick = () => {
            const detailsContainer = detailsToggle.nextElementSibling;
            const isCurrentlyVisible = detailsContainer.style.display !== 'none';
            
            DomUtils.toggleVisibility(detailsContainer, !isCurrentlyVisible);
            
            detailsToggle.innerHTML = isCurrentlyVisible 
                ? '<i class="fas fa-chevron-down"></i>' 
                : '<i class="fas fa-chevron-up"></i>';
        };

        return detailsToggle;
    }

    static createDetailsContainer(lines) {
        const detailsContainer = DomUtils.createElement('div', ['library-details']);
        detailsContainer.style.display = 'none';

        const detailsContent = document.createElement('pre');
        const detailsCode = document.createElement('code');
        
        // Remove leading spaces/tabs from each line
        const trimmedLines = lines.map(line => line.trimStart());
        detailsCode.textContent = trimmedLines.join('\n');
        
        // Apply syntax highlighting
        detailsContent.appendChild(detailsCode);
        detailsContainer.appendChild(detailsContent);

        // Syntax highlighting
        hljs.highlightElement(detailsCode);

        return detailsContainer;
    }
}

export default LibraryResultRenderer;
