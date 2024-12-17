const LIBRARY_DETECTION_METHODS = {
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

const LIBRARY_FULL_NAMES = {
    'bootstrap': 'Bootstrap',
    'vue': 'Vue.js',
    'react': 'React',
    'tailwind': 'Tailwind CSS',
    'jquery': 'jQuery',
    'angular': 'Angular',
    'fontAwesome': 'Font Awesome',
    'webgl': 'WebGL'
};

class LibraryDetectionService {
    static async detectLibraries(url) {
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
            const data = await response.json();

            if (!data.contents) {
                throw new Error('Could not retrieve page contents');
            }

            return this.findDetectedLibraries(data.contents);
        } catch (error) {
            console.error('Library detection error:', error);
            throw error;
        }
    }

    static findDetectedLibraries(html) {
        return Object.entries(LIBRARY_DETECTION_METHODS)
            .map(([key, method]) => {
                const lines = method(html);
                return lines.length > 0 
                    ? { 
                        key, 
                        name: LIBRARY_FULL_NAMES[key], 
                        lines 
                    } 
                    : null;
            })
            .filter(result => result !== null);
    }
}

export default LibraryDetectionService;
