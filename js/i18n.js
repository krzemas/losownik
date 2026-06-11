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
            match: 'Mecz', coin: 'Moneta', color: 'Kolor', cards: 'Karty',
            teams: 'Drużyny', order: 'Kolejność', picker: 'Wylicz.', number: 'Liczba',
            roll: 'Rzuć kostką!', generate: 'Losuj!', spin: 'Zakręć kołem!', flip: 'Rzuć monetą!',
            history: 'Historia rzutów', result: 'Wynik',
            back: 'Wszystkie narzędzia', homepage: 'Strona główna', privacy: 'Polityka prywatności',
            langLabel: 'Język', footer: '© 2006–2026 Losownik.pl – Internetowa maszyna losująca',
            selectLang: 'Wybierz język'
        },
        en: {
            home: 'Home', dice: 'Dice', wheel: 'Wheel', lotto: 'Lotto', name: 'Name',
            match: 'Match', coin: 'Coin', color: 'Color', cards: 'Cards',
            teams: 'Teams', order: 'Order', picker: 'Picker', number: 'Number',
            roll: 'Roll dice!', generate: 'Generate!', spin: 'Spin the wheel!', flip: 'Flip coin!',
            history: 'Roll history', result: 'Result',
            back: 'All tools', homepage: 'Home page', privacy: 'Privacy policy',
            langLabel: 'Language', footer: '© 2006–2026 Losownik.pl – Online random generator',
            selectLang: 'Select language'
        },
        de: {
            home: 'Start', dice: 'Würfel', wheel: 'Rad', lotto: 'Lotto', name: 'Name',
            match: 'Spiel', coin: 'Münze', color: 'Farbe', cards: 'Karten',
            teams: 'Teams', order: 'Reihenf.', picker: 'Auswahl', number: 'Zahl',
            roll: 'Würfeln!', generate: 'Generieren!', spin: 'Drehen!', flip: 'Münze werfen!',
            history: 'Verlauf', result: 'Ergebnis',
            back: 'Alle Werkzeuge', homepage: 'Startseite', privacy: 'Datenschutz',
            langLabel: 'Sprache', footer: '© 2006–2026 Losownik.pl – Online Zufallsgenerator',
            selectLang: 'Sprache wählen'
        },
        es: {
            home: 'Inicio', dice: 'Dado', wheel: 'Ruleta', lotto: 'Loto', name: 'Nombre',
            match: 'Partido', coin: 'Moneda', color: 'Color', cards: 'Cartas',
            teams: 'Equipos', order: 'Orden', picker: 'Elegir', number: 'Número',
            roll: '¡Tirar dado!', generate: '¡Generar!', spin: '¡Girar!', flip: '¡Lanzar moneda!',
            history: 'Historial', result: 'Resultado',
            back: 'Todas las herramientas', homepage: 'Inicio', privacy: 'Privacidad',
            langLabel: 'Idioma', footer: '© 2006–2026 Losownik.pl – Generador aleatorio en línea',
            selectLang: 'Seleccionar idioma'
        },
        fr: {
            home: 'Accueil', dice: 'Dé', wheel: 'Roue', lotto: 'Loto', name: 'Prénom',
            match: 'Match', coin: 'Pièce', color: 'Couleur', cards: 'Cartes',
            teams: 'Équipes', order: 'Ordre', picker: 'Tirage', number: 'Nombre',
            roll: 'Lancer !', generate: 'Générer !', spin: 'Tourner !', flip: 'Lancer la pièce !',
            history: 'Historique', result: 'Résultat',
            back: 'Tous les outils', homepage: 'Accueil', privacy: 'Confidentialité',
            langLabel: 'Langue', footer: '© 2006–2026 Losownik.pl – Générateur aléatoire en ligne',
            selectLang: 'Choisir la langue'
        },
        it: {
            home: 'Home', dice: 'Dado', wheel: 'Ruota', lotto: 'Lotto', name: 'Nome',
            match: 'Partita', coin: 'Moneta', color: 'Colore', cards: 'Carte',
            teams: 'Squadre', order: 'Ordine', picker: 'Scelta', number: 'Numero',
            roll: 'Lancia!', generate: 'Genera!', spin: 'Gira!', flip: 'Lancia la moneta!',
            history: 'Cronologia', result: 'Risultato',
            back: 'Tutti gli strumenti', homepage: 'Home', privacy: 'Privacy',
            langLabel: 'Lingua', footer: '© 2006–2026 Losownik.pl – Generatore casuale online',
            selectLang: 'Seleziona lingua'
        },
        pt: {
            home: 'Início', dice: 'Dado', wheel: 'Roleta', lotto: 'Loto', name: 'Nome',
            match: 'Jogo', coin: 'Moeda', color: 'Cor', cards: 'Cartas',
            teams: 'Equipes', order: 'Ordem', picker: 'Sortear', number: 'Número',
            roll: 'Jogar!', generate: 'Gerar!', spin: 'Girar!', flip: 'Jogar moeda!',
            history: 'Histórico', result: 'Resultado',
            back: 'Todas as ferramentas', homepage: 'Início', privacy: 'Privacidade',
            langLabel: 'Idioma', footer: '© 2006–2026 Losownik.pl – Gerador aleatório online',
            selectLang: 'Selecionar idioma'
        },
        ru: {
            home: 'Главная', dice: 'Кубик', wheel: 'Колесо', lotto: 'Лото', name: 'Имя',
            match: 'Матч', coin: 'Монета', color: 'Цвет', cards: 'Карты',
            teams: 'Команды', order: 'Порядок', picker: 'Выбор', number: 'Число',
            roll: 'Бросить!', generate: 'Генерировать!', spin: 'Крутить!', flip: 'Подбросить!',
            history: 'История', result: 'Результат',
            back: 'Все инструменты', homepage: 'Главная', privacy: 'Конфиденциальность',
            langLabel: 'Язык', footer: '© 2006–2026 Losownik.pl – Онлайн генератор',
            selectLang: 'Выбрать язык'
        },
        cs: {
            home: 'Domů', dice: 'Kostka', wheel: 'Kolo', lotto: 'Loto', name: 'Jméno',
            match: 'Zápas', coin: 'Mince', color: 'Barva', cards: 'Karty',
            teams: 'Týmy', order: 'Pořadí', picker: 'Výběr', number: 'Číslo',
            roll: 'Hodit!', generate: 'Generovat!', spin: 'Točit!', flip: 'Hodit mincí!',
            history: 'Historie', result: 'Výsledek',
            back: 'Všechny nástroje', homepage: 'Domů', privacy: 'Soukromí',
            langLabel: 'Jazyk', footer: '© 2006–2026 Losownik.pl – Online generátor',
            selectLang: 'Vybrat jazyk'
        },
        uk: {
            home: 'Головна', dice: 'Кубик', wheel: 'Колесо', lotto: 'Лото', name: "Ім'я",
            match: 'Матч', coin: 'Монета', color: 'Колір', cards: 'Карти',
            teams: 'Команди', order: 'Порядок', picker: 'Вибір', number: 'Число',
            roll: 'Кинути!', generate: 'Генерувати!', spin: 'Крутити!', flip: 'Підкинути!',
            history: 'Історія', result: 'Результат',
            back: 'Всі інструменти', homepage: 'Головна', privacy: 'Конфіденційність',
            langLabel: 'Мова', footer: '© 2006–2026 Losownik.pl – Онлайн генератор',
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

    // Apply translations to elements with data-i18n attribute AND known selectors
    function applyTranslations() {
        if (currentLang === DEFAULT_LANG) return; // Polish is default, no need to translate
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = t(key);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
        });
        
        // Auto-translate mobile nav
        const navMap = {
            'Start': t('home'), 'Kostka': t('dice'), 'Koło': t('wheel'),
            'Lotto': t('lotto'), 'Imię': t('name'), 'Mecz': t('match'),
            'Moneta': t('coin'), 'Kolor': t('color'), 'Karty': t('cards'),
            'Drużyny': t('teams'), 'Kolejność': t('order'), 'RPG': 'RPG',
            'Wylicz.': t('picker'), 'Liczba': t('number')
        };
        document.querySelectorAll('.mobile-nav a, .top-nav a, nav a').forEach(el => {
            const text = el.textContent.trim();
            if (navMap[text]) el.childNodes[el.childNodes.length - 1].textContent = navMap[text];
        });
        
        // Auto-translate buttons
        document.querySelectorAll('.roll-btn, .generate-btn, .flip-btn, .spin-btn').forEach(btn => {
            const text = btn.textContent.trim();
            if (text.includes('Rzuć kostką')) btn.innerHTML = btn.innerHTML.replace('Rzuć kostką!', t('roll'));
            if (text.includes('Losuj')) btn.innerHTML = btn.innerHTML.replace(/Losuj[^!]*!/, t('generate'));
            if (text.includes('Zakręć')) btn.innerHTML = btn.innerHTML.replace('Zakręć kołem!', t('spin'));
            if (text.includes('monetą')) btn.innerHTML = btn.innerHTML.replace('Rzuć monetą!', t('flip'));
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
