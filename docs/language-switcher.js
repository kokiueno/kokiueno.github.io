// Language Switcher Functionality

// An explicit choice wins; otherwise follow the browser. Japanese visitors
// landing on the English page get offered machine translation, which leaves
// the name as romaji — showing them the Japanese page up front avoids that
// entirely, and keeps <html lang> matching what is actually on screen.
function detectLanguage() {
    const saved = localStorage.getItem('language');
    if (saved === 'en' || saved === 'ja') return saved;

    const preferred = navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language || 'en'];
    return preferred.some(l => String(l).toLowerCase().startsWith('ja')) ? 'ja' : 'en';
}

let currentLanguage = detectLanguage();

// Set <html lang> before first paint so the browser does not offer to
// translate a page that is already in the reader's language.
setLanguage(currentLanguage);

document.addEventListener('DOMContentLoaded', function () {
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
    document.documentElement.lang = lang === 'en' ? 'en' : 'ja';
    const elements = document.querySelectorAll('[data-en][data-ja]');
    elements.forEach(element => {
        element.textContent = element.getAttribute(lang === 'en' ? 'data-en' : 'data-ja');
    });
}

function updateButtonText() {
    const button = document.getElementById('language-toggle');
    if (button) {
        button.textContent = currentLanguage === 'en' ? '日本語' : 'English';
    }
}
