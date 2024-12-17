const DomUtils = {
    createElement(tag, classes = [], innerHTML = null) {
        const element = document.createElement(tag);
        
        if (classes.length > 0) {
            element.classList.add(...classes);
        }
        
        if (innerHTML !== null) {
            element.innerHTML = innerHTML;
        }
        
        return element;
    },

    clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    },

    toggleVisibility(element, isVisible) {
        element.style.display = isVisible ? 'block' : 'none';
    }
};

export default DomUtils;
