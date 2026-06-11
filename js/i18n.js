/**
 * Losownik.pl - Lightweight i18n System
 * Handles language switching via localStorage + URL parameter
 */
(function() {
    'use strict';

    const SUPPORTED_LANGS = ['pl','en','de','es','fr','it','pt','ru','cs','uk'];
    const DEFAULT_LANG = 'pl';
    const STORAGE_KEY = 'losownik_lang';

    // Detect language: URL param > localStorage > browser > default
    function detectLang() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && SUPPORTED_LANGS.includes(urlLang)) {
            localStorage.setItem(STORAGE_KEY, urlLang);
            return urlLang;
        }
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
        const browserLang = (navigator.language || '').slice(0, 2).toLowerCase();
        if (SUPPORTED_LANGS.includes(browserLang)) return browserLang;
        return DEFAULT_LANG;
    }

    // Translation dictionaries (common UI elements)
    const translations = {
        pl: {
            home: 'Start', dice: 'Kostka', wheel: 'Koło', lotto: 'Lotto', name: 'Imię',
            roll: 'Rzuć kostką!', generate: 'Losuj!', spin: 'Zakręć!', flip: 'Rzuć monetą!',
            history: 'Historia rzutów', result: 'Wynik', teams: 'Drużyny',
            back: 'Wszystkie narzędzia', homepage: 'Strona główna', privacy: 'Polityka prywatności',
            langLabel: 'Język', footer: '© 2006–2026 Losownik.pl – Internetowa maszyna losująca',
            selectLang: 'Wybierz język'
        },
        en: {
            home: 'Home', dice: 'Dice', wheel: 'Wheel', lotto: 'Lotto', name: 'Name',
            roll: 'Roll dice!', generate: 'Generate!', spin: 'Spin!', flip: 'Flip coin!',
            history: 'Roll history', result: 'Result', teams: 'Teams',
            back: 'All tools', homepage: 'Home page', privacy: 'Privacy policy',
            langLabel: 'Language', footer: '© 2006–2026 Losownik.pl – Online random generator',
            selectLang: 'Select language'
        },
        de: {
            home: 'Start', dice: 'Würfel', wheel: 'Rad', lotto: 'Lotto', name: 'Name',
            roll: 'Würfeln!', generate: 'Generieren!', spin: 'Drehen!', flip: 'Münze werfen!',
            history: 'Verlauf', result: 'Ergebnis', teams: 'Teams',
            back: 'Alle Werkzeuge', homepage: 'Startseite', privacy: 'Datenschutz',
            langLabel: 'Sprache', footer: '© 2006–2026 Losownik.pl – Online Zufallsgenerator',
            selectLang: 'Sprache wählen'
        },
        es: {
            home: 'Inicio', dice: 'Dado', wheel: 'Ruleta', lotto: 'Loto', name: 'Nombre',
            roll: '¡Tirar dado!', generate: '¡Generar!', spin: '¡Girar!', flip: '¡Lanzar moneda!',
            history: 'Historial', result: 'Resultado', teams: 'Equipos',
            back: 'Todas las herramientas', homepage: 'Inicio', privacy: 'Privacidad',
            langLabel: 'Idioma', footer: '© 2006–2026 Losownik.pl – Generador aleatorio en línea',
            selectLang: 'Seleccionar idioma'
        },
        fr: {
            home: 'Accueil', dice: 'Dé', wheel: 'Roue', lotto: 'Loto', name: 'Prénom',
            roll: 'Lancer le dé !', generate: 'Générer !', spin: 'Tourner !', flip: 'Lancer la pièce !',
            history: 'Historique', result: 'Résultat', teams: 'Équipes',
            back: 'Tous les outils', homepage: 'Accueil', privacy: 'Confidentialité',
            langLabel: 'Langue', footer: '© 2006–2026 Losownik.pl – Générateur aléatoire en ligne',
            selectLang: 'Choisir la langue'
        },
        it: {
            home: 'Home', dice: 'Dado', wheel: 'Ruota', lotto: 'Lotto', name: 'Nome',
            roll: 'Lancia il dado!', generate: 'Genera!', spin: 'Gira!', flip: 'Lancia la moneta!',
            history: 'Cronologia', result: 'Risultato', teams: 'Squadre',
            back: 'Tutti gli strumenti', homepage: 'Home', privacy: 'Privacy',
            langLabel: 'Lingua', footer: '© 2006–2026 Losownik.pl – Generatore casuale online',
            selectLang: 'Seleziona lingua'
        },
        pt: {
            home: 'Início', dice: 'Dado', wheel: 'Roleta', lotto: 'Loto', name: 'Nome',
            roll: 'Jogar dado!', generate: 'Gerar!', spin: 'Girar!', flip: 'Jogar moeda!',
            history: 'Histórico', result: 'Resultado', teams: 'Equipes',
            back: 'Todas as ferramentas', homepage: 'Início', privacy: 'Privacidade',
            langLabel: 'Idioma', footer: '© 2006–2026 Losownik.pl – Gerador aleatório online',
            selectLang: 'Selecionar idioma'
        },
        ru: {
            home: 'Главная', dice: 'Кубик', wheel: 'Колесо', lotto: 'Лото', name: 'Имя',
            roll: 'Бросить кубик!', generate: 'Генерировать!', spin: 'Крутить!', flip: 'Подбросить монету!',
            history: 'История бросков', result: 'Результат', teams: 'Команды',
            back: 'Все инструменты', homepage: 'Главная', privacy: 'Конфиденциальность',
            langLabel: 'Язык', footer: '© 2006–2026 Losownik.pl – Онлайн генератор случайных чисел',
            selectLang: 'Выбрать язык'
        },
        cs: {
            home: 'Domů', dice: 'Kostka', wheel: 'Kolo', lotto: 'Loto', name: 'Jméno',
            roll: 'Hodit kostkou!', generate: 'Generovat!', spin: 'Točit!', flip: 'Hodit mincí!',
            history: 'Historie hodů', result: 'Výsledek', teams: 'Týmy',
            back: 'Všechny nástroje', homepage: 'Domů', privacy: 'Soukromí',
            langLabel: 'Jazyk', footer: '© 2006–2026 Losownik.pl – Online generátor náhodných čísel',
            selectLang: 'Vybrat jazyk'
        },
        uk: {
            home: 'Головна', dice: 'Кубик', wheel: 'Колесо', lotto: 'Лото', name: "Ім'я",
            roll: 'Кинути кубик!', generate: 'Генерувати!', spin: 'Крутити!', flip: 'Підкинути монету!',
            history: 'Історія кидків', result: 'Результат', teams: 'Команди',
            back: 'Всі інструменти', homepage: 'Головна', privacy: 'Конфіденційність',
            langLabel: 'Мова', footer: '© 2006–2026 Losownik.pl – Онлайн генератор випадкових чисел',
            selectLang: 'Обрати мову'
        }
    };

    const langNames = {
        pl: 'Polski', en: 'English', de: 'Deutsch', es: 'Español',
        fr: 'Français', it: 'Italiano', pt: 'Português', ru: 'Русский',
        cs: 'Čeština', uk: 'Українська'
    };

    const currentLang = detectLang();

    // Get translation
    function t(key) {
        return (translations[currentLang] && translations[currentLang][key]) || 
               (translations[DEFAULT_LANG] && translations[DEFAULT_LANG][key]) || key;
    }

    // Apply translations to elements with data-i18n attribute
    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = t(key);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
        });
        // Set html lang attribute
        document.documentElement.lang = currentLang;
    }

    // Create language switcher dropdown
    function createLangSwitcher() {
        const container = document.getElementById('langSwitcher');
        if (!container) return;
        
        const select = document.createElement('select');
        select.className = 'lang-select';
        select.setAttribute('aria-label', t('selectLang'));
        
        SUPPORTED_LANGS.forEach(lang => {
            const opt = document.createElement('option');
            opt.value = lang;
            opt.textContent = langNames[lang];
            if (lang === currentLang) opt.selected = true;
            select.appendChild(opt);
        });
        
        select.addEventListener('change', (e) => {
            localStorage.setItem(STORAGE_KEY, e.target.value);
            // Reload with new lang (or just re-apply if single page)
            window.location.reload();
        });
        
        container.appendChild(select);
    }

    // Expose globally
    window.losownikI18n = { t, currentLang, translations, applyTranslations, SUPPORTED_LANGS, langNames };

    // Auto-apply on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { applyTranslations(); createLangSwitcher(); });
    } else {
        applyTranslations();
        createLangSwitcher();
    }
})();
