/**
 * Losownik.pl - i18n System v4 (complete)
 * Language switcher, nav translation, hreflang, SEO
 */
(function() {
    'use strict';

    var SUPPORTED = ['pl','en','de','es','fr','it','pt','ru','cs','uk'];
    var NAMES = {pl:'Polski',en:'English',de:'Deutsch',es:'Español',fr:'Français',it:'Italiano',pt:'Português',ru:'Русский',cs:'Čeština',uk:'Українська'};
    var KEY = 'losownik_lang';

    // Detect language from URL param
    var urlLang = new URLSearchParams(window.location.search).get('lang');
    if (urlLang && SUPPORTED.indexOf(urlLang)>=0) localStorage.setItem(KEY, urlLang);
    var lang = localStorage.getItem(KEY) || 'pl';
    if (SUPPORTED.indexOf(lang)<0) lang='pl';

    // Navigation translations
    var NAV = {
        en:{Start:'Home',Kostka:'Dice',Mecz:'Match','Imię':'Name',Lotto:'Lotto','Koło':'Wheel','Koło fortuny':'Wheel',Moneta:'Coin',Kolor:'Color',Karty:'Cards','Drużyny':'Teams','Kolejność':'Order',RPG:'RPG','Wylicz.':'Picker',Liczba:'Number'},
        de:{Start:'Start',Kostka:'Würfel',Mecz:'Spiel','Imię':'Name',Lotto:'Lotto','Koło':'Rad','Koło fortuny':'Rad',Moneta:'Münze',Kolor:'Farbe',Karty:'Karten','Drużyny':'Teams','Kolejność':'Reihenf.',RPG:'RPG','Wylicz.':'Auswahl',Liczba:'Zahl'},
        es:{Start:'Inicio',Kostka:'Dado',Mecz:'Partido','Imię':'Nombre',Lotto:'Loto','Koło':'Ruleta','Koło fortuny':'Ruleta',Moneta:'Moneda',Kolor:'Color',Karty:'Cartas','Drużyny':'Equipos','Kolejność':'Orden',RPG:'RPG','Wylicz.':'Elegir',Liczba:'Número'},
        fr:{Start:'Accueil',Kostka:'Dé',Mecz:'Match','Imię':'Prénom',Lotto:'Loto','Koło':'Roue','Koło fortuny':'Roue',Moneta:'Pièce',Kolor:'Couleur',Karty:'Cartes','Drużyny':'Équipes','Kolejność':'Ordre',RPG:'RPG','Wylicz.':'Tirage',Liczba:'Nombre'},
        it:{Start:'Home',Kostka:'Dado',Mecz:'Partita','Imię':'Nome',Lotto:'Lotto','Koło':'Ruota','Koło fortuny':'Ruota',Moneta:'Moneta',Kolor:'Colore',Karty:'Carte','Drużyny':'Squadre','Kolejność':'Ordine',RPG:'RPG','Wylicz.':'Scelta',Liczba:'Numero'},
        pt:{Start:'Início',Kostka:'Dado',Mecz:'Jogo','Imię':'Nome',Lotto:'Loto','Koło':'Roleta','Koło fortuny':'Roleta',Moneta:'Moeda',Kolor:'Cor',Karty:'Cartas','Drużyny':'Equipes','Kolejność':'Ordem',RPG:'RPG','Wylicz.':'Sortear',Liczba:'Número'},
        ru:{Start:'Главная',Kostka:'Кубик',Mecz:'Матч','Imię':'Имя',Lotto:'Лото','Koło':'Колесо','Koło fortuny':'Колесо',Moneta:'Монета',Kolor:'Цвет',Karty:'Карты','Drużyny':'Команды','Kolejność':'Порядок',RPG:'RPG','Wylicz.':'Выбор',Liczba:'Число'},
        cs:{Start:'Domů',Kostka:'Kostka',Mecz:'Zápas','Imię':'Jméno',Lotto:'Loto','Koło':'Kolo','Koło fortuny':'Kolo',Moneta:'Mince',Kolor:'Barva',Karty:'Karty','Drużyny':'Týmy','Kolejność':'Pořadí',RPG:'RPG','Wylicz.':'Výběr',Liczba:'Číslo'},
        uk:{Start:'Головна',Kostka:'Кубик',Mecz:'Матч','Imię':"Ім'я",Lotto:'Лото','Koło':'Колесо','Koło fortuny':'Колесо',Moneta:'Монета',Kolor:'Колір',Karty:'Карти','Drużyny':'Команди','Kolejність':'Порядок','Kolejność':'Порядок',RPG:'RPG','Wylicz.':'Вибір',Liczba:'Число'}
    };


    function init() {
        var header = document.querySelector('header');
        if (!header) return;

        // 1. Remove any existing language switcher
        document.querySelectorAll('.lang-switcher').forEach(function(el){el.remove();});
        var existingSelects = header.querySelectorAll('div[style*="margin-left"]');
        existingSelects.forEach(function(el){if(el.querySelector('select'))el.remove();});

        // 2. Create language switcher
        var wrapper = document.createElement('div');
        wrapper.className = 'lang-switcher';
        var select = document.createElement('select');
        select.className = 'lang-select';
        select.setAttribute('aria-label', 'Language / Język');
        SUPPORTED.forEach(function(l) {
            var opt = document.createElement('option');
            opt.value = l; opt.textContent = NAMES[l];
            if (l === lang) opt.selected = true;
            select.appendChild(opt);
        });
        select.addEventListener('change', function(e) {
            localStorage.setItem(KEY, e.target.value);
            // Update URL with lang param for SEO crawlability
            var url = new URL(window.location.href);
            if(e.target.value==='pl') url.searchParams.delete('lang');
            else url.searchParams.set('lang', e.target.value);
            window.location.href = url.toString();
        });
        wrapper.appendChild(select);
        header.appendChild(wrapper);

        // 3. Translate navigation if not Polish
        if (lang === 'pl' || !NAV[lang]) return;
        var dict = NAV[lang];

        document.querySelectorAll('.mobile-nav a, .top-nav a, header nav a').forEach(function(link) {
            var nodes = link.childNodes;
            for (var i = nodes.length - 1; i >= 0; i--) {
                if (nodes[i].nodeType === 3) {
                    var text = nodes[i].textContent.trim();
                    if (dict[text]) nodes[i].textContent = dict[text];
                    break;
                }
            }
        });

        // 4. Set HTML lang attribute
        document.documentElement.lang = lang;
    }


    // 5. Add hreflang tags for SEO
    function addHreflang() {
        // Remove existing hreflang
        document.querySelectorAll('link[hreflang]').forEach(function(el){el.remove();});

        var base = 'https://losownik.pl';
        var pathname = window.location.pathname;

        // x-default (Polish = default)
        var linkDef = document.createElement('link');
        linkDef.rel = 'alternate';
        linkDef.hreflang = 'x-default';
        linkDef.href = base + pathname;
        document.head.appendChild(linkDef);

        // Polish (no lang param)
        var linkPl = document.createElement('link');
        linkPl.rel = 'alternate';
        linkPl.hreflang = 'pl';
        linkPl.href = base + pathname;
        document.head.appendChild(linkPl);

        // Other languages
        SUPPORTED.forEach(function(l) {
            if (l === 'pl') return;
            var link = document.createElement('link');
            link.rel = 'alternate';
            link.hreflang = l;
            link.href = base + pathname + '?lang=' + l;
            document.head.appendChild(link);
        });

        // Update canonical for non-Polish
        var canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            if (lang !== 'pl') {
                canonical.href = base + pathname + '?lang=' + lang;
            } else {
                canonical.href = base + pathname;
            }
        }
    }

    // Inject CSS for lang-select
    var style = document.createElement('style');
    style.textContent = '.lang-switcher{display:flex;align-items:center;margin-left:auto}.lang-select{background:#1a1a3e;border:1px solid rgba(123,47,247,0.3);color:#a0a0c0;padding:6px 10px;border-radius:8px;font-size:.78rem;font-family:inherit;font-weight:600;cursor:pointer;transition:all .2s;appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\'%3E%3Cpath d=\'M0 0l5 6 5-6z\' fill=\'%23a0a0c0\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center;padding-right:24px}.lang-select:hover,.lang-select:focus{border-color:#00f5d4;color:#00f5d4;outline:none}@media(max-width:768px){.lang-switcher{position:fixed;top:12px;right:12px;z-index:1001}.lang-select{font-size:.7rem;padding:5px 20px 5px 8px}}';
    document.head.appendChild(style);

    // Run
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function(){init();addHreflang();});
    } else {
        init();
        addHreflang();
    }
})();
