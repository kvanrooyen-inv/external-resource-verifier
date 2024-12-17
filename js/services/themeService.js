const ThemeService = {
    LIGHT_THEME: 'light',
    DARK_THEME: 'dark',
    
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || this.LIGHT_THEME;
        document.body.classList.toggle('dark-theme', savedTheme === this.DARK_THEME);
        return savedTheme;
    },
    
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const currentTheme = document.body.classList.contains('dark-theme') 
            ? this.DARK_THEME 
            : this.LIGHT_THEME;
        
        localStorage.setItem('theme', currentTheme);
        return currentTheme;
    }
};

export default ThemeService;
