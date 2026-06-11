/**
 * Losownik.pl - i18n System v3 (bulletproof)
 * Creates language switcher and translates navigation/buttons
 */
(function() {
    'use strict';

    const SUPPORTED = ['pl','en','de','es','fr','it','pt','ru','cs','uk'];
    const NAMES = {pl:'Polski',en:'English',de:'Deutsch',es:'Español',fr:'Français',it:'Italiano',pt:'Português',ru:'Русский',cs:'Čeština',uk:'Українська'};
    const KEY = 'losownik_lang';

    // Detect language
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    if (urlLang && SUPPORTED.includes(urlLang)) localStorage.setItem(KEY, urlLang);
    const lang = localStorage.getItem(KEY) || 'pl';

    // Translations
    const T = {
        pl:{home:'Start',dice:'Kostka',match:'Mecz',name:'Imię',lotto:'Lotto',wheel:'Koło',coin:'Moneta',color:'Kolor',cards:'Karty',teams:'Drużyny',order:'Kolejność',rpg:'RPG',picker:'Wylicz.',number:'Liczba'},
        en:{home:'Home',dice:'Dice',match:'Match',name:'Name',lotto:'Lotto',wheel:'Wheel',coin:'Coin',color:'Color',cards:'Cards',teams:'Teams',order:'Order',rpg:'RPG',picker:'Picker',number:'Number'},
        de:{home:'Start',dice:'Würfel',match:'Spiel',name:'Name',lotto:'Lotto',wheel:'Rad',coin:'Münze',color:'Farbe',cards:'Karten',teams:'Teams',order:'Reihenf.',rpg:'RPG',picker:'Auswahl',number:'Zahl'},
        es:{home:'Inicio',dice:'Dado',match:'Partido',name:'Nombre',lotto:'Loto',wheel:'Ruleta',coin:'Moneda',color:'Color',cards:'Cartas',teams:'Equipos',order:'Orden',rpg:'RPG',picker:'Elegir',number:'Número'},
        fr:{home:'Accueil',dice:'Dé',match:'Match',name:'Prénom',lotto:'Loto',wheel:'Roue',coin:'Pièce',color:'Couleur',cards:'Cartes',teams:'Équipes',order:'Ordre',rpg:'RPG',picker:'Tirage',number:'Nombre'},
        it:{home:'Home',dice:'Dado',match:'Partita',name:'Nome',lotto:'Lotto',wheel:'Ruota',coin:'Moneta',color:'Colore',cards:'Carte',teams:'Squadre',order:'Ordine',rpg:'RPG',picker:'Scelta',number:'Numero'},
        pt:{home:'Início',dice:'Dado',match:'Jogo',name:'Nome',lotto:'Loto',wheel:'Roleta',coin:'Moeda',color:'Cor',cards:'Cartas',teams:'Equipes',order:'Ordem',rpg:'RPG',picker:'Sortear',number:'Número'},
        ru:{home:'Главная',dice:'Кубик',match:'Матч',name:'Имя',lotto:'Лото',wheel:'Колесо',coin:'Монета',color:'Цвет',cards:'Карты',teams:'Команды',order:'Порядок',rpg:'RPG',picker:'Выбор',number:'Число'},
        cs:{home:'Domů',dice:'Kostka',match:'Zápas',name:'Jméno',lotto:'Loto',wheel:'Kolo',coin:'Mince',color:'Barva',cards:'Karty',teams:'Týmy',order:'Pořadí',rpg:'RPG',picker:'Výběr',number:'Číslo'},
        uk:{home:'Головна',dice:'Кубик',match:'Матч',name:"Ім'я",lotto:'Лото',wheel:'Колесо',coin:'Монета',color:'Колір',cards:'Карти',teams:'Команди',order:'Порядок',rpg:'RPG',picker:'Вибір',number:'Число'}
    };

    // Map Polish nav text → translation key
    const NAV_MAP = {'Start':'home','Kostka':'dice','Mecz':'match','Imię':'name','Lotto':'lotto','Koło':'wheel','Moneta':'coin','Kolor':'color','Karty':'cards','Drużyny':'teams','Kolejność':'order','RPG':'rpg','Wylicz.':'picker','Liczba':'number'};

    function init() {
        // 1. Create language switcher (inject into header directly)
        const header = document.querySelector('header');
        if (!header) return;

        // Remove any existing langSwitcher divs
        document.querySelectorAll('.lang-switcher, #langSwitcher').forEach(el => el.remove());

        const wrapper = document.createElement('div');
        wrapper.className = 'lang-switcher';
        const select = document.createElement('select');
        select.className = 'lang-select';
        select.setAttribute('aria-label', 'Language');
        SUPPORTED.forEach(l => {
            const opt = document.createElement('option');
            opt.value = l; opt.textContent = NAMES[l];
            if (l === lang) opt.selected = true;
            select.appendChild(opt);
        });
        select.addEventListener('change', e => {
            localStorage.setItem(KEY, e.target.value);
            window.location.reload();
        });
        wrapper.appendChild(select);
        header.appendChild(wrapper);

        // 2. Translate nav if not Polish
        if (lang === 'pl' || !T[lang]) return;
        const dict = T[lang];

        // Translate all nav links (mobile + desktop)
        document.querySelectorAll('.mobile-nav a, .top-nav a, header nav a').forEach(link => {
            const nodes = link.childNodes;
            for (let i = nodes.length - 1; i >= 0; i--) {
                if (nodes[i].nodeType === 3) { // text node
                    const text = nodes[i].textContent.trim();
                    if (NAV_MAP[text] && dict[NAV_MAP[text]]) {
                        nodes[i].textContent = dict[NAV_MAP[text]];
                    }
                    break;
                }
            }
        });

        document.documentElement.lang = lang;
    }

    // Inject CSS for lang-select (consistent dark style everywhere)
    const style = document.createElement('style');
    style.textContent = '.lang-switcher{display:flex;align-items:center;margin-left:auto}.lang-select{background:#1a1a3e;border:1px solid rgba(123,47,247,0.3);color:#a0a0c0;padding:6px 10px;border-radius:8px;font-size:.78rem;font-family:inherit;font-weight:600;cursor:pointer;transition:all .2s;appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\'%3E%3Cpath d=\'M0 0l5 6 5-6z\' fill=\'%23a0a0c0\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center;padding-right:24px}.lang-select:hover,.lang-select:focus{border-color:#00f5d4;color:#00f5d4;outline:none}@media(max-width:768px){.lang-switcher{position:fixed;top:12px;right:12px;z-index:1001}.lang-select{font-size:.7rem;padding:5px 20px 5px 8px}}';
    document.head.appendChild(style);

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
