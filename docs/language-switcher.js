// Language Switcher Functionality
let currentLanguage = localStorage.getItem('language') || 'en';

// Set initial language on page load
document.addEventListener('DOMContentLoaded', function() {
    setLanguage(currentLanguage);
    updateButtonText();
});

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ja' : 'en';
    localStorage.setItem('language', currentLanguage);
    setLanguage(currentLanguage);
    updateButtonText();
}

function setLanguage(lang) {
    const elements = document.querySelectorAll('[data-en][data-ja]');
    elements.forEach(element => {
        if (lang === 'en') {
            element.textContent = element.getAttribute('data-en');
        } else {
            element.textContent = element.getAttribute('data-ja');
        }
    });
}

function updateButtonText() {
    const button = document.getElementById('language-toggle');
    if (button) {
        button.textContent = currentLanguage === 'en' ? '日本語' : 'English';
    }
}
