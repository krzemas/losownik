#!/usr/bin/env node
/**
 * build-i18n.js - Static HTML i18n generator for losownik.pl
 * Generates translated HTML files for each language version.
 */

const fs = require('fs');
const path = require('path');

// ============ CONFIGURATION ============
const LANGUAGES = ['en', 'de', 'es', 'fr', 'it', 'pt', 'ru', 'cs', 'uk'];
const ALL_LANGS = ['pl', ...LANGUAGES];
const BASE_URL = 'https://losownik.pl';

const PAGES = [
  'index.html', 'kostka.html', 'mecz.html', 'imie.html', 'lotto.html',
  'moneta.html', 'kolo-fortuny.html', 'kolor.html', 'karty.html',
  'druzyny.html', 'kolejnosc.html', 'wyliczanka.html', 'liczba.html', 'postac.html'
];

const PAGE_SLUGS = PAGES.map(p => '/' + p.replace('.html', ''));
// "/" for index
PAGE_SLUGS[0] = '/';


// Navigation labels per language
const NAV_LABELS = {
  pl: { '/': 'Start', '/kostka': 'Kostka', '/mecz': 'Mecz', '/imie': 'Imię', '/lotto': 'Lotto', '/kolo-fortuny': 'Koło', '/moneta': 'Moneta', '/kolor': 'Kolor', '/karty': 'Karty', '/druzyny': 'Drużyny', '/kolejnosc': 'Kolejność', '/postac': 'RPG', '/wyliczanka': 'Wylicz.', '/liczba': 'Liczba' },
  en: { '/': 'Home', '/kostka': 'Dice', '/mecz': 'Match', '/imie': 'Name', '/lotto': 'Lotto', '/kolo-fortuny': 'Wheel', '/moneta': 'Coin', '/kolor': 'Color', '/karty': 'Cards', '/druzyny': 'Teams', '/kolejnosc': 'Order', '/postac': 'RPG', '/wyliczanka': 'Picker', '/liczba': 'Number' },
  de: { '/': 'Start', '/kostka': 'Würfel', '/mecz': 'Spiel', '/imie': 'Name', '/lotto': 'Lotto', '/kolo-fortuny': 'Rad', '/moneta': 'Münze', '/kolor': 'Farbe', '/karty': 'Karten', '/druzyny': 'Teams', '/kolejnosc': 'Folge', '/postac': 'RPG', '/wyliczanka': 'Wahl', '/liczba': 'Zahl' },
  es: { '/': 'Inicio', '/kostka': 'Dados', '/mecz': 'Partido', '/imie': 'Nombre', '/lotto': 'Loto', '/kolo-fortuny': 'Ruleta', '/moneta': 'Moneda', '/kolor': 'Color', '/karty': 'Cartas', '/druzyny': 'Equipos', '/kolejnosc': 'Orden', '/postac': 'RPG', '/wyliczanka': 'Elector', '/liczba': 'Número' },
  fr: { '/': 'Accueil', '/kostka': 'Dés', '/mecz': 'Match', '/imie': 'Prénom', '/lotto': 'Loto', '/kolo-fortuny': 'Roue', '/moneta': 'Pièce', '/kolor': 'Couleur', '/karty': 'Cartes', '/druzyny': 'Équipes', '/kolejnosc': 'Ordre', '/postac': 'RPG', '/wyliczanka': 'Tirage', '/liczba': 'Nombre' },
  it: { '/': 'Home', '/kostka': 'Dadi', '/mecz': 'Partita', '/imie': 'Nome', '/lotto': 'Lotto', '/kolo-fortuny': 'Ruota', '/moneta': 'Moneta', '/kolor': 'Colore', '/karty': 'Carte', '/druzyny': 'Squadre', '/kolejnosc': 'Ordine', '/postac': 'RPG', '/wyliczanka': 'Sorteggio', '/liczba': 'Numero' },
  pt: { '/': 'Início', '/kostka': 'Dados', '/mecz': 'Jogo', '/imie': 'Nome', '/lotto': 'Loto', '/kolo-fortuny': 'Roda', '/moneta': 'Moeda', '/kolor': 'Cor', '/karty': 'Cartas', '/druzyny': 'Equipes', '/kolejnosc': 'Ordem', '/postac': 'RPG', '/wyliczanka': 'Sorteio', '/liczba': 'Número' },
  ru: { '/': 'Главная', '/kostka': 'Кубик', '/mecz': 'Матч', '/imie': 'Имя', '/lotto': 'Лото', '/kolo-fortuny': 'Колесо', '/moneta': 'Монета', '/kolor': 'Цвет', '/karty': 'Карты', '/druzyny': 'Команды', '/kolejnosc': 'Порядок', '/postac': 'RPG', '/wyliczanka': 'Выбор', '/liczba': 'Число' },
  cs: { '/': 'Domů', '/kostka': 'Kostka', '/mecz': 'Zápas', '/imie': 'Jméno', '/lotto': 'Loto', '/kolo-fortuny': 'Kolo', '/moneta': 'Mince', '/kolor': 'Barva', '/karty': 'Karty', '/druzyny': 'Týmy', '/kolejnosc': 'Pořadí', '/postac': 'RPG', '/wyliczanka': 'Výběr', '/liczba': 'Číslo' },
  uk: { '/': 'Головна', '/kostka': 'Кубик', '/mecz': 'Матч', '/imie': "Ім'я", '/lotto': 'Лото', '/kolo-fortuny': 'Колесо', '/moneta': 'Монета', '/kolor': 'Колір', '/karty': 'Карти', '/druzyny': 'Команди', '/kolejnosc': 'Порядок', '/postac': 'RPG', '/wyliczanka': 'Вибір', '/liczba': 'Число' }
};


// Language display names for the switcher
const LANG_NAMES = {
  pl: 'Polski', en: 'English', de: 'Deutsch', es: 'Español',
  fr: 'Français', it: 'Italiano', pt: 'Português', ru: 'Русский',
  cs: 'Čeština', uk: 'Українська'
};

// Card translations (not in translations.js)
const CARD_TRANSLATIONS = {
  en: { suits: [{name:'Hearts',symbol:'♥',color:'red'},{name:'Diamonds',symbol:'♦',color:'red'},{name:'Clubs',symbol:'♣',color:'black'},{name:'Spades',symbol:'♠',color:'black'}], values_names: {Walet:'Jack',Dama:'Queen',Król:'King',As:'Ace'}, values_display: {W:'J',D:'Q',K:'K',A:'A'}, remaining:'Remaining:', cards:'cards', deckEmpty:'Deck empty! Click "Shuffle"', shuffle:'Shuffle' },
  de: { suits: [{name:'Herz',symbol:'♥',color:'red'},{name:'Karo',symbol:'♦',color:'red'},{name:'Kreuz',symbol:'♣',color:'black'},{name:'Pik',symbol:'♠',color:'black'}], values_names: {Walet:'Bube',Dama:'Dame',Król:'König',As:'Ass'}, values_display: {W:'B',D:'D',K:'K',A:'A'}, remaining:'Verbleibend:', cards:'Karten', deckEmpty:'Deck leer! Klicke "Mischen"', shuffle:'Mischen' },
  es: { suits: [{name:'Corazones',symbol:'♥',color:'red'},{name:'Diamantes',symbol:'♦',color:'red'},{name:'Tréboles',symbol:'♣',color:'black'},{name:'Picas',symbol:'♠',color:'black'}], values_names: {Walet:'Jota',Dama:'Reina',Król:'Rey',As:'As'}, values_display: {W:'J',D:'Q',K:'K',A:'A'}, remaining:'Restantes:', cards:'cartas', deckEmpty:'¡Baraja vacía! Haz clic en "Barajar"', shuffle:'Barajar' },
  fr: { suits: [{name:'Cœur',symbol:'♥',color:'red'},{name:'Carreau',symbol:'♦',color:'red'},{name:'Trèfle',symbol:'♣',color:'black'},{name:'Pique',symbol:'♠',color:'black'}], values_names: {Walet:'Valet',Dama:'Dame',Król:'Roi',As:'As'}, values_display: {W:'V',D:'D',K:'R',A:'A'}, remaining:'Restantes :', cards:'cartes', deckEmpty:'Jeu vide ! Cliquez "Mélanger"', shuffle:'Mélanger' },
  it: { suits: [{name:'Cuori',symbol:'♥',color:'red'},{name:'Quadri',symbol:'♦',color:'red'},{name:'Fiori',symbol:'♣',color:'black'},{name:'Picche',symbol:'♠',color:'black'}], values_names: {Walet:'Fante',Dama:'Donna',Król:'Re',As:'Asso'}, values_display: {W:'F',D:'D',K:'R',A:'A'}, remaining:'Rimanenti:', cards:'carte', deckEmpty:'Mazzo vuoto! Clicca "Mescola"', shuffle:'Mescola' },
  pt: { suits: [{name:'Copas',symbol:'♥',color:'red'},{name:'Ouros',symbol:'♦',color:'red'},{name:'Paus',symbol:'♣',color:'black'},{name:'Espadas',symbol:'♠',color:'black'}], values_names: {Walet:'Valete',Dama:'Dama',Król:'Rei',As:'Ás'}, values_display: {W:'V',D:'D',K:'R',A:'A'}, remaining:'Restantes:', cards:'cartas', deckEmpty:'Baralho vazio! Clique em "Embaralhar"', shuffle:'Embaralhar' },
  ru: { suits: [{name:'Черви',symbol:'♥',color:'red'},{name:'Бубны',symbol:'♦',color:'red'},{name:'Трефы',symbol:'♣',color:'black'},{name:'Пики',symbol:'♠',color:'black'}], values_names: {Walet:'Валет',Dama:'Дама',Król:'Король',As:'Туз'}, values_display: {W:'В',D:'Д',K:'К',A:'Т'}, remaining:'Осталось:', cards:'карт', deckEmpty:'Колода пуста! Нажмите "Перетасовать"', shuffle:'Перетасовать' },
  cs: { suits: [{name:'Srdce',symbol:'♥',color:'red'},{name:'Káry',symbol:'♦',color:'red'},{name:'Kříže',symbol:'♣',color:'black'},{name:'Píky',symbol:'♠',color:'black'}], values_names: {Walet:'Kluk',Dama:'Dáma',Król:'Král',As:'Eso'}, values_display: {W:'K',D:'D',K:'K',A:'E'}, remaining:'Zbývá:', cards:'karet', deckEmpty:'Balíček prázdný! Klikněte "Zamíchat"', shuffle:'Zamíchat' },
  uk: { suits: [{name:'Черви',symbol:'♥',color:'red'},{name:'Бубни',symbol:'♦',color:'red'},{name:'Трефи',symbol:'♣',color:'black'},{name:'Піки',symbol:'♠',color:'black'}], values_names: {Walet:'Валет',Dama:'Дама',Król:'Король',As:'Туз'}, values_display: {W:'В',D:'Д',K:'К',A:'Т'}, remaining:'Залишилось:', cards:'карт', deckEmpty:'Колода порожня! Натисніть "Перетасувати"', shuffle:'Перетасувати' }
};


// ============ KARTY FAQ TRANSLATIONS (not in translations.js) ============
const KARTY_FAQ = {
  en: [
    { q: "How many cards in a deck?", a: "A standard deck has 52 cards: 4 suits (hearts, diamonds, clubs, spades) × 13 values (2-10, Jack, Queen, King, Ace)." },
    { q: "Do cards repeat?", a: "No! Each card is drawn without replacement. Once you draw all 52, click Shuffle to start over." },
    { q: "What can I use card drawing for?", a: "Card games (poker, blackjack, bridge), party games, magic tricks, raffles or just for fun." }
  ],
  de: [
    { q: "Wie viele Karten sind im Deck?", a: "Ein Standarddeck hat 52 Karten: 4 Farben (Herz, Karo, Kreuz, Pik) × 13 Werte (2-10, Bube, Dame, König, Ass)." },
    { q: "Wiederholen sich die Karten?", a: "Nein! Jede Karte wird ohne Zurücklegen gezogen. Wenn alle 52 gezogen sind, klicke Mischen um neu zu starten." },
    { q: "Wofür kann ich das Kartenziehen verwenden?", a: "Kartenspiele (Poker, Blackjack, Bridge), Partyspiele, Zaubertricks, Verlosungen oder einfach zum Spaß." }
  ],
  es: [
    { q: "¿Cuántas cartas hay en la baraja?", a: "Una baraja estándar tiene 52 cartas: 4 palos (corazones, diamantes, tréboles, picas) × 13 valores (2-10, Jota, Reina, Rey, As)." },
    { q: "¿Se repiten las cartas?", a: "¡No! Cada carta se saca sin reemplazo. Cuando saques las 52, haz clic en Barajar para empezar de nuevo." },
    { q: "¿Para qué puedo usar el sorteo de cartas?", a: "Juegos de cartas (póker, blackjack, bridge), juegos de fiesta, trucos de magia, sorteos o simplemente por diversión." }
  ],
  fr: [
    { q: "Combien de cartes dans le jeu ?", a: "Un jeu standard contient 52 cartes : 4 couleurs (cœur, carreau, trèfle, pique) × 13 valeurs (2-10, Valet, Dame, Roi, As)." },
    { q: "Les cartes se répètent-elles ?", a: "Non ! Chaque carte est tirée sans remise. Une fois les 52 tirées, cliquez Mélanger pour recommencer." },
    { q: "À quoi peut servir le tirage de cartes ?", a: "Jeux de cartes (poker, blackjack, bridge), jeux de société, tours de magie, tirages au sort ou simplement pour s'amuser." }
  ],
  it: [
    { q: "Quante carte ci sono nel mazzo?", a: "Un mazzo standard ha 52 carte: 4 semi (cuori, quadri, fiori, picche) × 13 valori (2-10, Fante, Donna, Re, Asso)." },
    { q: "Le carte si ripetono?", a: "No! Ogni carta viene pescata senza rimpiazzo. Quando peschi tutte le 52, clicca Mescola per ricominciare." },
    { q: "A cosa posso usare il pescaggio di carte?", a: "Giochi di carte (poker, blackjack, bridge), giochi di società, trucchi di magia, estrazioni o semplicemente per divertimento." }
  ],
  pt: [
    { q: "Quantas cartas há no baralho?", a: "Um baralho padrão tem 52 cartas: 4 naipes (copas, ouros, paus, espadas) × 13 valores (2-10, Valete, Dama, Rei, Ás)." },
    { q: "As cartas se repetem?", a: "Não! Cada carta é tirada sem reposição. Quando tirar todas as 52, clique em Embaralhar para recomeçar." },
    { q: "Para que posso usar o sorteio de cartas?", a: "Jogos de cartas (pôquer, blackjack, bridge), jogos de festa, truques de mágica, sorteios ou simplesmente por diversão." }
  ],
  ru: [
    { q: "Сколько карт в колоде?", a: "Стандартная колода содержит 52 карты: 4 масти (черви, бубны, трефы, пики) × 13 значений (2-10, Валет, Дама, Король, Туз)." },
    { q: "Карты повторяются?", a: "Нет! Каждая карта вытягивается без возврата. Когда вытянете все 52, нажмите Перетасовать чтобы начать заново." },
    { q: "Для чего можно использовать вытягивание карт?", a: "Карточные игры (покер, блэкджек, бридж), вечеринки, фокусы, розыгрыши или просто для развлечения." }
  ],
  cs: [
    { q: "Kolik karet je v balíčku?", a: "Standardní balíček má 52 karet: 4 barvy (srdce, káry, kříže, píky) × 13 hodnot (2-10, Kluk, Dáma, Král, Eso)." },
    { q: "Opakují se karty?", a: "Ne! Každá karta je vytažena bez vrácení. Když vytáhnete všech 52, klikněte Zamíchat pro nový začátek." },
    { q: "K čemu mohu vytahování karet použít?", a: "Karetní hry (poker, blackjack, bridž), společenské hry, kouzelnické triky, losování nebo prostě pro zábavu." }
  ],
  uk: [
    { q: "Скільки карт у колоді?", a: "Стандартна колода має 52 карти: 4 масті (черви, бубни, трефи, піки) × 13 значень (2-10, Валет, Дама, Король, Туз)." },
    { q: "Карти повторюються?", a: "Ні! Кожна карта витягується без повернення. Коли витягнете всі 52, натисніть Перетасувати щоб почати знову." },
    { q: "Для чого можна використовувати витягування карт?", a: "Карткові ігри (покер, блекджек, бридж), вечірки, фокуси, розіграші або просто для розваги." }
  ]
};

// Card hint translations
const CARD_HINT = {
  en: "Click the card to draw",
  de: "Klicke die Karte zum Ziehen",
  es: "Clic en la carta para sacar",
  fr: "Cliquez sur la carte pour tirer",
  it: "Clicca la carta per pescare",
  pt: "Clique na carta para tirar",
  ru: "Нажмите на карту чтобы вытянуть",
  cs: "Klikněte na kartu pro vytažení",
  uk: "Натисніть на карту щоб витягнути"
};

// Kostka aria-label translations
const KOSTKA_ARIA_LABEL = {
  en: "Click to roll the dice",
  de: "Klicken zum Würfeln",
  es: "Clic para tirar",
  fr: "Cliquez pour lancer",
  it: "Clicca per lanciare",
  pt: "Clique para jogar",
  ru: "Нажмите чтобы бросить",
  cs: "Klikněte pro hod",
  uk: "Натисніть щоб кинути"
};

// Kostka roll result translations (for JS fallback)
const KOSTKA_ROLL_RESULT = {
  en: "Roll result",
  de: "Wurfergebnis",
  es: "Resultado del tiro",
  fr: "Résultat du lancer",
  it: "Risultato del lancio",
  pt: "Resultado do lançamento",
  ru: "Результат броска",
  cs: "Výsledek hodu",
  uk: "Результат кидка"
};

// ============ LOAD TRANSLATIONS ============
// Execute the translations file in a sandboxed context
const translationsCode = fs.readFileSync(path.join(__dirname, 'js/translations.js'), 'utf8');
const window = {};
eval(translationsCode);
const COMMON = window.LOSOWNIK_COMMON;
const META = window.LOSOWNIK_META;
const T = window.LOSOWNIK_T;

let warnings = [];
function warn(msg) { warnings.push(msg); }

function getTranslation(obj, lang, key, fallback) {
  try {
    if (obj && obj[lang] && obj[lang][key] !== undefined) return obj[lang][key];
  } catch(e) {}
  if (fallback !== undefined) return fallback;
  warn(`Missing translation: ${lang}.${key}`);
  return null;
}


// ============ HELPER FUNCTIONS ============

function getPageSlug(filename) {
  if (filename === 'index.html') return '/';
  return '/' + filename.replace('.html', '');
}

function getCanonicalPath(filename) {
  if (filename === 'index.html') return '';
  return '/' + filename.replace('.html', '');
}

function buildHreflangLinks(pagePath) {
  // pagePath is like "/kostka" or "" (for index)
  let links = '';
  const plHref = pagePath ? `${BASE_URL}${pagePath}` : `${BASE_URL}/`;
  links += `    <link rel="alternate" hreflang="pl" href="${plHref}">\n`;
  for (const lang of LANGUAGES) {
    const href = pagePath ? `${BASE_URL}/${lang}${pagePath}` : `${BASE_URL}/${lang}/`;
    links += `    <link rel="alternate" hreflang="${lang}" href="${href}">\n`;
  }
  links += `    <link rel="alternate" hreflang="x-default" href="${plHref}">\n`;
  return links;
}

function buildLangSwitcher(lang, filename) {
  const pagePath = getCanonicalPath(filename);
  let options = '';
  for (const l of LANGUAGES) {
    const value = pagePath ? `/${l}${pagePath}` : `/${l}/`;
    const selected = l === lang ? ' selected' : '';
    options += `        <option value="${value}"${selected}>${LANG_NAMES[l]}</option>\n`;
  }
  // Polish option
  const plValue = pagePath ? pagePath : '/';
  options += `        <option value="${plValue}">${LANG_NAMES.pl}</option>\n`;
  
  return `<div class="lang-switcher">
      <select class="lang-select" onchange="window.location.href=this.value" aria-label="Language">
${options}      </select>
    </div>`;
}


function replaceInternalLinks(html, lang) {
  // Replace all internal navigation links to point to the language version
  // Order matters - do longer paths first, then shorter ones
  const slugs = ['/polityka-prywatnosci', '/kolo-fortuny', '/kolejnosc', '/wyliczanka', '/druzyny', '/kostka', '/moneta', '/postac', '/liczba', '/karty', '/mecz', '/imie', '/lotto', '/kolor'];
  
  for (const slug of slugs) {
    // href="/slug" -> href="/lang/slug"  (but not href="/slug/ with extra chars that aren't quotes)
    const re = new RegExp(`href="${slug}"`, 'g');
    html = html.replace(re, `href="/${lang}${slug}"`);
  }
  
  // Replace href="/" with href="/lang/" - but be careful not to replace /js/ etc
  // Only match exact href="/"
  html = html.replace(/href="\/"/g, `href="/${lang}/"`);
  
  return html;
}

function replaceHtmlLang(html, lang) {
  return html.replace(/<html lang="pl">/, `<html lang="${lang}">`);
}

function replaceTitle(html, title) {
  if (!title) return html;
  return html.replace(/<title>[^<]+<\/title>/, `<title>${title}</title>`);
}

function replaceMetaDescription(html, desc) {
  if (!desc) return html;
  return html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${desc}">`
  );
}

function replaceCanonical(html, lang, filename) {
  const pagePath = getCanonicalPath(filename);
  const canonical = pagePath ? `${BASE_URL}/${lang}${pagePath}` : `${BASE_URL}/${lang}/`;
  // Replace existing canonical
  if (html.includes('<link rel="canonical"')) {
    return html.replace(
      /<link rel="canonical" href="[^"]*">/,
      `<link rel="canonical" href="${canonical}">`
    );
  }
  // Add canonical if missing (e.g. index.html)
  return html.replace(
    '</head>',
    `    <link rel="canonical" href="${canonical}">\n</head>`
  );
}


function addHreflangLinks(html, filename) {
  const pagePath = getCanonicalPath(filename);
  const hreflangBlock = buildHreflangLinks(pagePath);
  // Insert before </head>
  return html.replace('</head>', hreflangBlock + '</head>');
}

function replaceLogoSubtitle(html, lang) {
  const subtitle = COMMON[lang] && COMMON[lang].subtitle;
  if (!subtitle) return html;
  return html.replace(
    /(<div class="logo-subtitle">)[^<]*(<\/div>)/,
    `$1${subtitle}$2`
  );
}

function replaceFooter(html, lang) {
  const home = COMMON[lang] && COMMON[lang].home;
  const privacy = COMMON[lang] && COMMON[lang].privacy;
  const subtitle = COMMON[lang] && COMMON[lang].subtitle;
  if (!home || !privacy) return html;
  // Replace footer text - handles both formats
  html = html.replace(/>Strona główna<\/a>/g, `>${home}</a>`);
  html = html.replace(/>Polityka prywatności<\/a>/g, `>${privacy}</a>`);
  // Index page format: "Internetowa maszyna losująca | Polityka prywatności"
  if (subtitle) {
    html = html.replace(
      /Losownik\.pl – Internetowa maszyna losująca/g,
      `Losownik.pl – ${subtitle}`
    );
  }
  return html;
}

function replaceH1(html, h1Text) {
  if (!h1Text) return html;
  return html.replace(
    /(<h1 class="page-title">)[^<]*(<span>)?[^<]*(<\/span>)?[^<]*(<\/h1>)/,
    `$1${h1Text}</h1>`
  );
}

function replacePageDesc(html, desc) {
  if (!desc) return html;
  // .page-desc or .hero p
  html = html.replace(
    /(<p class="page-desc">)[^<]*(<\/p>)/,
    `$1${desc}$2`
  );
  return html;
}


function replaceButtons(html, btnText) {
  if (!btnText) return html;
  // Replace roll-btn, generate-btn, flip-btn, spin-btn text (keeping the emoji icon)
  html = html.replace(
    /(<button[^>]*class="[^"]*(?:roll-btn|generate-btn|flip-btn|spin-btn)[^"]*"[^>]*>(?:&#\d+;\s*)?)([^<]+)(<\/button>)/g,
    `$1${btnText}$3`
  );
  return html;
}

function replaceBreadcrumb(html, lang, filename) {
  const home = COMMON[lang] && COMMON[lang].home;
  if (!home) return html;
  const pageSlug = getPageSlug(filename);
  const pageT = T[pageSlug] && T[pageSlug][lang];
  let pageName = '';
  if (pageT && pageT.h1) {
    pageName = pageT.h1.replace(/<[^>]+>/g, ''); // strip HTML tags
  }
  if (!pageName) {
    // Use nav label as fallback
    pageName = NAV_LABELS[lang] && NAV_LABELS[lang][pageSlug] || '';
  }
  
  // Replace breadcrumb
  html = html.replace(
    /(<nav class="breadcrumb"[^>]*>\s*<a href=")([^"]*)(">)[^<]*(<\/a><span>›<\/span>)[^<]*/,
    `$1/${lang}/$3${home}$4${pageName}`
  );
  return html;
}

function replaceFAQ(html, lang, pageSlug) {
  const pageT = T[pageSlug] && T[pageSlug][lang];
  if (!pageT || !pageT.faq || !Array.isArray(pageT.faq)) return html;
  
  const faqHeading = COMMON[lang] && COMMON[lang].faq || 'FAQ';
  
  let faqHtml = `<section class="faq">\n            <h2>${faqHeading}</h2>\n`;
  for (const item of pageT.faq) {
    faqHtml += `            <div class="faq-item">\n`;
    faqHtml += `                <h4>${item.q}</h4>\n`;
    faqHtml += `                <p>${item.a}</p>\n`;
    faqHtml += `            </div>\n`;
  }
  faqHtml += `        </section>`;
  
  // Replace existing FAQ section
  html = html.replace(
    /<section class="faq">[\s\S]*?<\/section>/,
    faqHtml
  );
  return html;
}


function replaceJsonLd(html, lang, pageSlug) {
  const pageT = T[pageSlug] && T[pageSlug][lang];
  if (!pageT || !pageT.faq || !Array.isArray(pageT.faq)) return html;
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": pageT.faq.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a }
    }))
  };
  
  const jsonLdStr = JSON.stringify(faqSchema, null, 8);
  
  // Replace existing JSON-LD
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n    ${jsonLdStr}\n    </script>`
  );
  return html;
}

function replaceTopNav(html, lang) {
  const labels = NAV_LABELS[lang];
  if (!labels) return html;
  
  // Replace top-nav links text (both short and full forms)
  html = html.replace(/>Kostka<\/a>/g, `>${labels['/kostka']}</a>`);
  html = html.replace(/>Mecz<\/a>/g, `>${labels['/mecz']}</a>`);
  html = html.replace(/>Imię<\/a>/g, `>${labels['/imie']}</a>`);
  html = html.replace(/>Lotto<\/a>/g, `>${labels['/lotto']}</a>`);
  html = html.replace(/>Koło fortuny<\/a>/g, `>${labels['/kolo-fortuny']}</a>`);
  html = html.replace(/>Koło<\/a>/g, `>${labels['/kolo-fortuny']}</a>`);
  html = html.replace(/>Kolor<\/a>/g, `>${labels['/kolor']}</a>`);
  html = html.replace(/>Moneta<\/a>/g, `>${labels['/moneta']}</a>`);
  
  return html;
}


function replaceMobileNav(html, lang) {
  const labels = NAV_LABELS[lang];
  if (!labels) return html;
  
  // Replace mobile nav text labels (after the nav-icon span)
  html = html.replace(/(&#127968;<\/span>)Start/g, `$1${labels['/']}`);
  html = html.replace(/(&#127922;<\/span>)Kostka/g, `$1${labels['/kostka']}`);
  html = html.replace(/(&#9917;<\/span>)Mecz/g, `$1${labels['/mecz']}`);
  html = html.replace(/(&#128100;<\/span>)Imię/g, `$1${labels['/imie']}`);
  html = html.replace(/(&#127920;<\/span>)Lotto/g, `$1${labels['/lotto']}`);
  html = html.replace(/(&#127905;<\/span>)Koło/g, `$1${labels['/kolo-fortuny']}`);
  html = html.replace(/(&#129689;<\/span>)Moneta/g, `$1${labels['/moneta']}`);
  html = html.replace(/(&#127912;<\/span>)Kolor/g, `$1${labels['/kolor']}`);
  html = html.replace(/(&#127183;<\/span>)Karty/g, `$1${labels['/karty']}`);
  html = html.replace(/(&#129351;<\/span>)Drużyny/g, `$1${labels['/druzyny']}`);
  html = html.replace(/(&#128260;<\/span>)Kolejność/g, `$1${labels['/kolejnosc']}`);
  html = html.replace(/(&#9876;<\/span>)RPG/g, `$1${labels['/postac']}`);
  html = html.replace(/(&#128101;<\/span>)Wylicz\./g, `$1${labels['/wyliczanka']}`);
  html = html.replace(/(&#128290;<\/span>)Liczba/g, `$1${labels['/liczba']}`);
  
  return html;
}

function addLangSwitcher(html, lang, filename) {
  const switcher = buildLangSwitcher(lang, filename);
  // Insert language switcher before </header> or after top-nav
  html = html.replace(
    /(<\/header>)/,
    `${switcher}\n        $1`
  );
  return html;
}


// ============ PAGE-SPECIFIC REPLACEMENTS ============

function replaceKostkaSpecific(html, lang) {
  const pageT = T['/kostka'] && T['/kostka'][lang];
  if (!pageT) return html;
  
  // Replace aria-label on dice scene
  if (KOSTKA_ARIA_LABEL[lang]) {
    html = html.replace(
      /aria-label="Kliknij aby rzucić kostką"/g,
      `aria-label="${KOSTKA_ARIA_LABEL[lang]}"`
    );
  }
  
  // Replace JS fallback 'Wynik rzutu'
  if (KOSTKA_ROLL_RESULT[lang]) {
    html = html.replace(
      /\|\|'Wynik rzutu'\)/g,
      `||'${KOSTKA_ROLL_RESULT[lang]}')`
    );
    // Replace the full window._losownikCommon pattern entirely
    html = html.replace(
      /\(\(window\._losownikCommon&&window\._losownikCommon\.rollResult\)\|\|'[^']*'\)/g,
      `'${KOSTKA_ROLL_RESULT[lang]}'`
    );
  }
  
  // Remove the window._losownikPage check - just use diceNamesPL directly
  html = html.replace(
    /const diceNames = \(window\._losownikPage && window\._losownikPage\.diceNames\) \? window\._losownikPage\.diceNames : diceNamesPL;/g,
    'const diceNames = diceNamesPL;'
  );
  
  // Replace dice type labels
  if (pageT.diceNames) {
    html = html.replace(/>standardowa<\/span>/g, `>${pageT.diceLabels && pageT.diceLabels[6] ? pageT.diceNames[6].split('(')[0].trim() : 'standard'}</span>`);
    html = html.replace(/(<span class="dice-label">)czworościan(<\/span>)/g, `$1${pageT.diceNames[4] ? pageT.diceNames[4].split('(')[0].trim() : 'tetrahedron'}$2`);
    html = html.replace(/(<span class="dice-label">)ośmiościan(<\/span>)/g, `$1${pageT.diceNames[8] ? pageT.diceNames[8].split('(')[0].trim() : 'octahedron'}$2`);
    html = html.replace(/(<span class="dice-label">)dziesięciościan(<\/span>)/g, `$1${pageT.diceNames[10] ? pageT.diceNames[10].split('(')[0].trim() : 'decahedron'}$2`);
    html = html.replace(/(<span class="dice-label">)dwunastościan(<\/span>)/g, `$1${pageT.diceNames[12] ? pageT.diceNames[12].split('(')[0].trim() : 'dodecahedron'}$2`);
    html = html.replace(/(<span class="dice-label">)d20 \/ RPG(<\/span>)/g, `$1${pageT.diceNames[20] ? pageT.diceNames[20].split('(')[0].trim() : 'd20 / RPG'}$2`);
    html = html.replace(/(<span class="dice-label">)procentowa(<\/span>)/g, `$1${pageT.diceNames[100] ? pageT.diceNames[100].split('(')[0].trim() : 'percentile'}$2`);
  }
  
  // "Wybierz rodzaj kostki"
  if (pageT.opts) {
    html = html.replace(/>Wybierz rodzaj kostki</, `>${pageT.opts}<`);
  }
  
  // Hint text
  if (pageT.hint) {
    html = html.replace(/>Kliknij kostkę aby rzucić</g, `>${pageT.hint}<`);
    html = html.replace(/Kliknij kostkę aby rzucić/g, pageT.hint);
  }
  
  // Current dice label
  if (pageT.label) {
    html = html.replace(/>Standardowa kostka \(k6\)</, `>${pageT.label}<`);
  }
  
  // History heading
  const historyLabel = COMMON[lang] && COMMON[lang].history;
  if (historyLabel) {
    html = html.replace(/>Historia rzutów</, `>${historyLabel}<`);
  }
  
  // noHistory
  const noHistory = COMMON[lang] && COMMON[lang].noHistory;
  if (noHistory) {
    html = html.replace(/>Brak rzutów – kliknij kostkę lub przycisk aby rozpocząć</, `>${noHistory}<`);
  }
  
  // rollResult / clickToRoll in result label
  const clickToRoll = COMMON[lang] && COMMON[lang].clickToRoll;
  if (clickToRoll) {
    html = html.replace(/>Kliknij aby rzucić<\/div>/, `>${clickToRoll}</div>`);
  }
  
  // Replace diceNames in JS - diceNamesPL object
  if (pageT.diceNames) {
    const newDiceNames = JSON.stringify(pageT.diceNames).replace(/"/g, "'");
    html = html.replace(
      /const diceNamesPL = \{[^}]+\};/,
      `const diceNamesPL = ${newDiceNames};`
    );
  }
  
  return html;
}


function replaceMeczSpecific(html, lang) {
  const pageT = T['/mecz'] && T['/mecz'][lang];
  if (!pageT) return html;
  
  // Sport button texts
  if (pageT.sports) {
    html = html.replace(/>Piłka nożna</g, `>${pageT.sports['Piłka nożna']}<`);
    html = html.replace(/>Siatkówka</g, `>${pageT.sports['Siatkówka']}<`);
    html = html.replace(/>Piłka ręczna</g, `>${pageT.sports['Piłka ręczna']}<`);
    html = html.replace(/>Koszykówka</g, `>${pageT.sports['Koszykówka']}<`);
  }
  
  // Team labels
  const hostLabel = COMMON[lang] && COMMON[lang].hostLabel;
  const guestLabel = COMMON[lang] && COMMON[lang].guestLabel;
  if (hostLabel) html = html.replace(/>Gospodarz</g, `>${hostLabel}<`);
  if (guestLabel) html = html.replace(/>Gość</g, `>${guestLabel}<`);
  
  // clickToGenerate
  const clickToGenerate = COMMON[lang] && COMMON[lang].clickToGenerate;
  if (clickToGenerate) {
    html = html.replace(/Kliknij przycisk aby wylosować wynik/g, clickToGenerate);
  }
  
  // Replace JS strings for match results
  const draw = COMMON[lang] && COMMON[lang].draw;
  const homeWin = COMMON[lang] && COMMON[lang].homeWin;
  const awayWin = COMMON[lang] && COMMON[lang].awayWin;
  const sets = COMMON[lang] && COMMON[lang].sets;
  if (draw) html = html.replace(/'Remis'/g, `'${draw}'`);
  if (homeWin) html = html.replace(/'Wygrana gospodarzy'/g, `'${homeWin}'`);
  if (awayWin) html = html.replace(/'Wygrana gości'/g, `'${awayWin}'`);
  if (sets) html = html.replace(/'Sety'/g, `'${sets}'`);
  
  // Remove _C references - replace _C.xxx||'...' with direct translated strings
  if (draw) html = html.replace(/_C\.draw\|\|'[^']*'/g, `'${draw}'`);
  if (homeWin) html = html.replace(/_C\.homeWin\|\|'[^']*'/g, `'${homeWin}'`);
  if (awayWin) html = html.replace(/_C\.awayWin\|\|'[^']*'/g, `'${awayWin}'`);
  if (sets) {
    html = html.replace(/_C\.sets\|\|'[^']*'/g, `'${sets}'`);
    html = html.replace(/_C\.set\|\|'[^']*'/g, `'${COMMON[lang].set || "Set"}'`);
  }
  // Remove the _C declaration line entirely
  html = html.replace(/\s*var _C=window\._losownikCommon\|\|\{\};/g, '');
  
  return html;
}

function replaceMonetaSpecific(html, lang) {
  const heads = COMMON[lang] && COMMON[lang].heads;
  const tails = COMMON[lang] && COMMON[lang].tails;
  const headsLabel = COMMON[lang] && COMMON[lang].headsLabel;
  const tailsLabel = COMMON[lang] && COMMON[lang].tailsLabel;
  const totalLabel = COMMON[lang] && COMMON[lang].totalLabel;
  const clickToFlip = COMMON[lang] && COMMON[lang].clickToFlip;
  
  if (headsLabel) html = html.replace(/>Orzeł</g, `>${headsLabel}<`);
  if (tailsLabel) html = html.replace(/>Reszka</g, `>${tailsLabel}<`);
  if (totalLabel) html = html.replace(/>Razem</g, `>${totalLabel}<`);
  if (clickToFlip) html = html.replace(/Kliknij monetę aby rzucić/g, clickToFlip);
  
  // JS result strings
  if (heads) html = html.replace(/'ORZEŁ'/g, `'${heads}'`);
  if (tails) html = html.replace(/'RESZKA'/g, `'${tails}'`);
  
  // Replace the window._losownikCommon pattern entirely
  if (heads) html = html.replace(
    /\(window\._losownikCommon&&window\._losownikCommon\.heads\)\|\|'[^']*'/g,
    `'${heads}'`
  );
  if (tails) html = html.replace(
    /\(window\._losownikCommon&&window\._losownikCommon\.tails\)\|\|'[^']*'/g,
    `'${tails}'`
  );
  
  return html;
}


function replaceLottoSpecific(html, lang) {
  const pageT = T['/lotto'] && T['/lotto'][lang];
  if (!pageT) return html;
  
  // HTML game-info spans (visible in buttons)
  const LOTTO_GAME_INFO = {
    en: {lotto:'6 of 49', minilotto:'5 of 42', multi:'20 of 80', joker:'6 digits'},
    de: {lotto:'6 aus 49', minilotto:'5 aus 42', multi:'20 aus 80', joker:'6 Ziffern'},
    es: {lotto:'6 de 49', minilotto:'5 de 42', multi:'20 de 80', joker:'6 dígitos'},
    fr: {lotto:'6 sur 49', minilotto:'5 sur 42', multi:'20 sur 80', joker:'6 chiffres'},
    it: {lotto:'6 su 49', minilotto:'5 su 42', multi:'20 su 80', joker:'6 cifre'},
    pt: {lotto:'6 de 49', minilotto:'5 de 42', multi:'20 de 80', joker:'6 dígitos'},
    ru: {lotto:'6 из 49', minilotto:'5 из 42', multi:'20 из 80', joker:'6 цифр'},
    cs: {lotto:'6 z 49', minilotto:'5 z 42', multi:'20 z 80', joker:'6 číslic'},
    uk: {lotto:'6 з 49', minilotto:'5 з 42', multi:'20 з 80', joker:'6 цифр'}
  };
  const gi = LOTTO_GAME_INFO[lang];
  if (gi) {
    html = html.replace(/>6 z 49</g, `>${gi.lotto}<`);
    html = html.replace(/>5 z 42</g, `>${gi.minilotto}<`);
    html = html.replace(/>20 z 80</g, `>${gi.multi}<`);
    html = html.replace(/>6 cyfr</g, `>${gi.joker}<`);
    // Initial result label "Lotto – 6 z 49"
    html = html.replace(/Lotto – 6 z 49/g, `Lotto – ${gi.lotto}`);
  }
  
  // Game info strings in JS
  if (pageT.games) {
    if (pageT.games.lotto) html = html.replace(/'Lotto \(6 z 49\)'/g, `'${pageT.games.lotto}'`);
    if (pageT.games.lotto) html = html.replace(/'Lotto \(6 of 49\)'/g, `'${pageT.games.lotto}'`);
    if (pageT.games.minilotto) html = html.replace(/'Mini Lotto \(5 z 42\)'/g, `'${pageT.games.minilotto}'`);
    if (pageT.games.minilotto) html = html.replace(/'Mini Lotto \(5 of 42\)'/g, `'${pageT.games.minilotto}'`);
    if (pageT.games.multi) html = html.replace(/'Multi Multi \(20 z 80\)'/g, `'${pageT.games.multi}'`);
    if (pageT.games.multi) html = html.replace(/'Multi Multi \(20 of 80\)'/g, `'${pageT.games.multi}'`);
    if (pageT.games.joker) html = html.replace(/'Joker \(6 z 49\)'/g, `'${pageT.games.joker}'`);
    if (pageT.games.joker) html = html.replace(/'Joker \(6 of 49\)'/g, `'${pageT.games.joker}'`);
  }
  
  // Remove _lottoI18n variable
  html = html.replace(/\s*var _lottoI18n=\(window\._losownikPage&&window\._losownikPage\.games\)\|\|\{\};/g, '');
  // Replace _lottoI18n.xxx||'Polish' with just the translated string
  if (pageT.games) {
    if (pageT.games.lotto) html = html.replace(/_lottoI18n\.lotto\|\|'[^']*'/g, `'${pageT.games.lotto}'`);
    if (pageT.games.minilotto) html = html.replace(/_lottoI18n\.minilotto\|\|'[^']*'/g, `'${pageT.games.minilotto}'`);
    if (pageT.games.multi) html = html.replace(/_lottoI18n\.multi\|\|'[^']*'/g, `'${pageT.games.multi}'`);
    if (pageT.games.joker) html = html.replace(/_lottoI18n\.joker\|\|'[^']*'/g, `'${pageT.games.joker}'`);
  }
  // Replace the drawn/Wylosowane pattern
  const drawn = COMMON[lang] && COMMON[lang].drawn;
  if (drawn) html = html.replace(
    /\(\(window\._losownikCommon&&window\._losownikCommon\.drawn\)\|\|'[^']*'\)/g,
    `'${drawn}'`
  );
  
  // clickNumbers
  const clickNumbers = COMMON[lang] && COMMON[lang].clickNumbers;
  if (clickNumbers) {
    html = html.replace(/Kliknij przycisk aby wylosować liczby/g, clickNumbers);
  }
  
  return html;
}

function replaceImieSpecific(html, lang) {
  const pageT = T['/imie'] && T['/imie'][lang];
  if (!pageT) return html;
  
  // Type button texts (buttons have emoji entities before the text, e.g. &#128104; Imię męskie)
  if (pageT.types) {
    html = html.replace(/(&#128104;\s*)Imię męskie/g, `$1${pageT.types['Imię męskie']}`);
    html = html.replace(/(&#128105;\s*)Imię żeńskie/g, `$1${pageT.types['Imię żeńskie']}`);
    html = html.replace(/(&#128100;\s*)Imię i nazwisko/g, `$1${pageT.types['Imię i nazwisko']}`);
  }
  
  // Info strings in JS
  const maleInfo = COMMON[lang] && COMMON[lang].maleInfo;
  const femaleInfo = COMMON[lang] && COMMON[lang].femaleInfo;
  const fullMale = COMMON[lang] && COMMON[lang].fullMale;
  const fullFemale = COMMON[lang] && COMMON[lang].fullFemale;
  const clickName = COMMON[lang] && COMMON[lang].clickName;
  
  if (maleInfo) html = html.replace(/'Imię męskie'/g, `'${maleInfo}'`);
  if (femaleInfo) html = html.replace(/'Imię żeńskie'/g, `'${femaleInfo}'`);
  if (fullMale) html = html.replace(/'Imię i nazwisko \(mężczyzna\)'/g, `'${fullMale}'`);
  if (fullFemale) html = html.replace(/'Imię i nazwisko \(kobieta\)'/g, `'${fullFemale}'`);
  if (clickName) html = html.replace(/Kliknij przycisk aby wylosować/g, clickName);
  
  // Remove the _C variable approach
  html = html.replace(/\s*var _C=window\._losownikCommon\|\|\{\};/g, '');
  // Replace _C.xxx||'Polish' patterns
  if (maleInfo) html = html.replace(/_C\.maleInfo\|\|'[^']*'/g, `'${maleInfo}'`);
  if (femaleInfo) html = html.replace(/_C\.femaleInfo\|\|'[^']*'/g, `'${femaleInfo}'`);
  if (fullMale) html = html.replace(/_C\.fullMale\|\|'[^']*'/g, `'${fullMale}'`);
  if (fullFemale) html = html.replace(/_C\.fullFemale\|\|'[^']*'/g, `'${fullFemale}'`);
  
  return html;
}


function replaceKartySpecific(html, lang) {
  const ct = CARD_TRANSLATIONS[lang];
  if (!ct) return html;
  
  // Replace suit names in JS
  const suits = ct.suits;
  html = html.replace(
    /const suits = \[\{name:'Kier'[^\]]+\];/,
    `const suits = [${suits.map(s => `{name:'${s.name}',symbol:'${s.symbol}',color:'${s.color}'}`).join(',')}];`
  );
  
  // Replace card value names
  html = html.replace(
    /\{name:'Walet',display:'W'\}/g,
    `{name:'${ct.values_names.Walet}',display:'${ct.values_display.W}'}`
  );
  html = html.replace(
    /\{name:'Dama',display:'D'\}/g,
    `{name:'${ct.values_names.Dama}',display:'${ct.values_display.D}'}`
  );
  html = html.replace(
    /\{name:'Król',display:'K'\}/g,
    `{name:'${ct.values_names.Król}',display:'${ct.values_display.K}'}`
  );
  html = html.replace(
    /\{name:'As',display:'A'\}/g,
    `{name:'${ct.values_names.As}',display:'${ct.values_display.A}'}`
  );
  
  // "Pozostało: 52 karty"
  html = html.replace(/Pozostało: 52 karty/g, `${ct.remaining} 52 ${ct.cards}`);
  html = html.replace(/'Pozostało: ' \+ deck\.length \+ ' kart'/g, `'${ct.remaining} ' + deck.length + ' ${ct.cards}'`);
  
  // "Talia pusta! Kliknij "Przetasuj""
  html = html.replace(/Talia pusta! Kliknij "Przetasuj"/g, ct.deckEmpty);
  
  // "Przetasuj" button (has emoji &#128260; before text)
  html = html.replace(/(&#128260;\s*)Przetasuj/g, `$1${ct.shuffle}`);
  
  // Card hint
  if (CARD_HINT[lang]) {
    html = html.replace(/>Kliknij kartę aby wyciągnąć</g, `>${CARD_HINT[lang]}<`);
    html = html.replace(/Kliknij kartę aby wyciągnąć/g, CARD_HINT[lang]);
  }
  
  // FAQ for karty page (added directly since not in LOSOWNIK_T)
  if (KARTY_FAQ[lang]) {
    const faqHeading = COMMON[lang] && COMMON[lang].faq || 'FAQ';
    let faqHtml = `<section class="faq">\n            <h2>${faqHeading}</h2>\n`;
    for (const item of KARTY_FAQ[lang]) {
      faqHtml += `            <div class="faq-item">\n`;
      faqHtml += `                <h4>${item.q}</h4>\n`;
      faqHtml += `                <p>${item.a}</p>\n`;
      faqHtml += `            </div>\n`;
    }
    faqHtml += `        </section>`;
    html = html.replace(
      /<section class="faq">[\s\S]*?<\/section>/,
      faqHtml
    );
  }
  
  return html;
}

function replaceKoloFortunySpecific(html, lang) {
  const pageT = T['/kolo-fortuny'] && T['/kolo-fortuny'][lang];
  if (!pageT) return html;
  
  // Label
  if (pageT.label) {
    html = html.replace(/Opcje \(po jednej w linii\):/g, pageT.label);
  }
  
  // Settings hint
  const settingsHint = COMMON[lang] && COMMON[lang].settingsHint;
  if (settingsHint) {
    html = html.replace(/Minimum 2 opcje\. Każda opcja w osobnej linii\./g, settingsHint);
  }
  
  return html;
}

function replaceWyliczankaSpecific(html, lang) {
  const pageT = T['/wyliczanka'] && T['/wyliczanka'][lang];
  if (!pageT) return html;
  
  // Label
  if (pageT.label) {
    html = html.replace(/Wpisz imiona \(po jednym w linii\):/g, pageT.label);
    html = html.replace(/Imiona \(po jednym w linii\):/g, pageT.label);
  }
  
  // Error messages from COMMON
  const pickerMin = COMMON[lang] && COMMON[lang].pickerMin;
  if (pickerMin) {
    html = html.replace(/Wpisz co najmniej 2 imiona!/g, pickerMin);
  }
  
  return html;
}


function replaceDruzynySpecific(html, lang) {
  const playersLabel = COMMON[lang] && COMMON[lang].playersLabel;
  const teamsLabel = COMMON[lang] && COMMON[lang].teamsLabel;
  const team = COMMON[lang] && COMMON[lang].team;
  
  if (playersLabel) html = html.replace(/Gracze \(po jednym w linii\):/g, playersLabel);
  if (teamsLabel) html = html.replace(/Liczba drużyn:/g, teamsLabel);
  if (team) html = html.replace(/'Drużyna'/g, `'${team}'`);
  
  return html;
}

function replaceKolejnoscSpecific(html, lang) {
  const itemsLabel = COMMON[lang] && COMMON[lang].itemsLabel;
  if (itemsLabel) {
    html = html.replace(/Elementy \(po jednym w linii\):/g, itemsLabel);
  }
  return html;
}

function replaceLiczbaSpecific(html, lang) {
  const minLabel = COMMON[lang] && COMMON[lang].minLabel;
  const maxLabel = COMMON[lang] && COMMON[lang].maxLabel;
  const countLabel = COMMON[lang] && COMMON[lang].countLabel;
  
  if (minLabel) html = html.replace(/>Min:</g, `>${minLabel}`);
  if (maxLabel) html = html.replace(/>Maks:</g, `>${maxLabel}`);
  if (countLabel) html = html.replace(/>Ilość:</g, `>${countLabel}`);
  
  return html;
}

function replaceKolorSpecific(html, lang) {
  const hexLabel = COMMON[lang] && COMMON[lang].hexLabel;
  const rgbLabel = COMMON[lang] && COMMON[lang].rgbLabel;
  const hslLabel = COMMON[lang] && COMMON[lang].hslLabel;
  const copied = COMMON[lang] && COMMON[lang].copied;
  
  if (copied) html = html.replace(/'Skopiowano!'/g, `'${copied}'`);
  
  return html;
}


// ============ INDEX PAGE (HOMEPAGE) SPECIFIC ============

function replaceIndexSpecific(html, lang) {
  const pageT = T['/'] && T['/'][lang];
  if (!pageT) return html;
  
  // Replace JSON-LD description with translated meta description
  const meta = META['/'] && META['/'][lang];
  if (meta && meta.desc) {
    html = html.replace(
      /(<script type="application\/ld\+json">[\s\S]*?"description":\s*")[^"]*("[\s\S]*?<\/script>)/,
      `$1${meta.desc}$2`
    );
  }
  
  // Hero heading (index uses h2 inside .hero section)
  if (pageT.hero) {
    html = html.replace(
      /(<section class="hero">\s*<h2>)[\s\S]*?(<\/h2>)/,
      `$1${pageT.hero}$2`
    );
  }
  
  // Hero description (plain <p> after h2 in .hero)
  if (pageT.heroDesc) {
    html = html.replace(
      /(<section class="hero">\s*<h2>[\s\S]*?<\/h2>\s*<p>)[^<]*(<\/p>)/,
      `$1${pageT.heroDesc}$2`
    );
  }
  
  // Tool cards - replace titles (h3) and subtitles (p)
  if (pageT.cards) {
    const cardMap = pageT.cards;
    // h3 titles
    if (cardMap.kostka) html = html.replace(/>Rzut kostką<\/h3>/g, `>${cardMap.kostka}</h3>`);
    if (cardMap.mecz) html = html.replace(/>Wynik meczu<\/h3>/g, `>${cardMap.mecz}</h3>`);
    if (cardMap.imie) html = html.replace(/>Losowe imię<\/h3>/g, `>${cardMap.imie}</h3>`);
    if (cardMap.lotto) html = html.replace(/>LOTTO<\/h3>/g, `>${cardMap.lotto}</h3>`);
    if (cardMap.wyliczanka) html = html.replace(/>Wyliczanka<\/h3>/g, `>${cardMap.wyliczanka}</h3>`);
    if (cardMap.liczba) html = html.replace(/>Losowa liczba<\/h3>/g, `>${cardMap.liczba}</h3>`);
    if (cardMap.kolo) html = html.replace(/>Koło fortuny<\/h3>/g, `>${cardMap.kolo}</h3>`);
    if (cardMap.kolor) html = html.replace(/>Losowy kolor<\/h3>/g, `>${cardMap.kolor}</h3>`);
    if (cardMap.druzyny) html = html.replace(/>Losowanie drużyn<\/h3>/g, `>${cardMap.druzyny}</h3>`);
    if (cardMap.kolejnosc) html = html.replace(/>Losowa kolejność<\/h3>/g, `>${cardMap.kolejnosc}</h3>`);
    if (cardMap.postac) html = html.replace(/>Generator postaci RPG<\/h3>/g, `>${cardMap.postac}</h3>`);
    if (cardMap.moneta) html = html.replace(/>Rzut monetą<\/h3>/g, `>${cardMap.moneta}</h3>`);
    if (cardMap.karty) html = html.replace(/>Losowanie karty<\/h3>/g, `>${cardMap.karty}</h3>`);
    // Subtitles (p inside tool-card)
    if (cardMap.kostkaSub) html = html.replace(/>Kostki k4, k6, k8, k12, k20, k100 z animacją 3D\. Idealne do gier RPG i planszowych\.<\/p>/g, `>${cardMap.kostkaSub}</p>`);
    if (cardMap.meczSub) html = html.replace(/>Losowy wynik meczu piłki nożnej, siatkówki, koszykówki lub piłki ręcznej\.<\/p>/g, `>${cardMap.meczSub}</p>`);
    if (cardMap.imieSub) html = html.replace(/>Wylosuj imię męskie, żeńskie lub pełne dane\. Statystyki popularności w Polsce\.<\/p>/g, `>${cardMap.imieSub}</p>`);
    if (cardMap.lottoSub) html = html.replace(/>Generuj liczby do Lotto, Mini Lotto, Multi Multi i Jokera\.<\/p>/g, `>${cardMap.lottoSub}</p>`);
    if (cardMap.wyliczankaSub) html = html.replace(/>Wpisz imiona znajomych – losownik wybierze jedną osobę za Ciebie\.<\/p>/g, `>${cardMap.wyliczankaSub}</p>`);
    if (cardMap.liczbaSub) html = html.replace(/>Generator losowych liczb z dowolnego zakresu\. Jedna lub wiele naraz\.<\/p>/g, `>${cardMap.liczbaSub}</p>`);
    if (cardMap.koloSub) html = html.replace(/>Wpisz opcje, zakręć kołem i pozwól losowi zdecydować!<\/p>/g, `>${cardMap.koloSub}</p>`);
    if (cardMap.kolorSub) html = html.replace(/>Wylosuj kolor w formacie HEX, RGB lub z palety\.<\/p>/g, `>${cardMap.kolorSub}</p>`);
    if (cardMap.druzynySub) html = html.replace(/>Podziel graczy na równe zespoły – idealny do gier zespołowych\.<\/p>/g, `>${cardMap.druzynySub}</p>`);
    if (cardMap.kolejnoscSub) html = html.replace(/>Wymieszaj listę i ustal losową kolejność – kto zaczyna grę\?<\/p>/g, `>${cardMap.kolejnoscSub}</p>`);
    if (cardMap.postacSub) html = html.replace(/>Losowe statystyki, rasa, klasa i imię – gotowa postać do gier fabularnych\.<\/p>/g, `>${cardMap.postacSub}</p>`);
    if (cardMap.monetaSub) html = html.replace(/>Orzeł czy reszka\? Klasyczny rzut monetą z animacją obrotu\.<\/p>/g, `>${cardMap.monetaSub}</p>`);
    if (cardMap.kartySub) html = html.replace(/>Wyciągnij losową kartę z talii 52 kart\. Z dźwiękiem tasowania!<\/p>/g, `>${cardMap.kartySub}</p>`);
  }
  
  return html;
}


// ============ MAIN PROCESSING FUNCTION ============

function processFile(filename, lang) {
  const srcPath = path.join(__dirname, filename);
  if (!fs.existsSync(srcPath)) {
    warn(`Source file not found: ${filename}`);
    return null;
  }
  
  let html = fs.readFileSync(srcPath, 'utf8');
  const pageSlug = getPageSlug(filename);
  const metaKey = pageSlug === '/' ? '/' : pageSlug;
  
  // Get translations
  const meta = META[metaKey] && META[metaKey][lang];
  const pageT = T[metaKey] && T[metaKey][lang];
  
  // 1. Replace html lang
  html = replaceHtmlLang(html, lang);
  
  // 2. Replace title
  if (meta && meta.title) {
    html = replaceTitle(html, meta.title);
  } else {
    warn(`Missing META title for ${lang} ${metaKey}`);
  }
  
  // 3. Replace meta description
  if (meta && meta.desc) {
    html = replaceMetaDescription(html, meta.desc);
  }
  
  // 3b. Remove keywords meta tag (ignored by Google, avoids Polish text leaks)
  html = html.replace(/\s*<meta name="keywords" content="[^"]*">\n?/g, '\n');
  
  // 4. Replace canonical
  html = replaceCanonical(html, lang, filename);
  
  // 5. Add hreflang links
  html = addHreflangLinks(html, filename);
  
  // 6. Replace internal links (BEFORE nav text replacement)
  html = replaceInternalLinks(html, lang);
  
  // 7. Replace H1
  if (pageT && pageT.h1) {
    html = replaceH1(html, pageT.h1);
  }
  
  // 8. Replace page description
  if (pageT && pageT.desc) {
    html = replacePageDesc(html, pageT.desc);
  }
  
  // 9. Replace buttons
  if (pageT && pageT.btn) {
    html = replaceButtons(html, pageT.btn);
  }
  
  // 10. Replace breadcrumb
  html = replaceBreadcrumb(html, lang, filename);
  
  // 11. Replace FAQ
  html = replaceFAQ(html, lang, metaKey);
  
  // 12. Replace JSON-LD
  html = replaceJsonLd(html, lang, metaKey);
  
  // 13. Replace footer
  html = replaceFooter(html, lang);
  
  // 14. Replace logo subtitle
  html = replaceLogoSubtitle(html, lang);
  
  // 15. Replace navigation text
  html = replaceTopNav(html, lang);
  html = replaceMobileNav(html, lang);
  
  // 16. Page-specific replacements
  switch (metaKey) {
    case '/kostka': html = replaceKostkaSpecific(html, lang); break;
    case '/mecz': html = replaceMeczSpecific(html, lang); break;
    case '/moneta': html = replaceMonetaSpecific(html, lang); break;
    case '/lotto': html = replaceLottoSpecific(html, lang); break;
    case '/imie': html = replaceImieSpecific(html, lang); break;
    case '/karty': html = replaceKartySpecific(html, lang); break;
    case '/kolo-fortuny': html = replaceKoloFortunySpecific(html, lang); break;
    case '/wyliczanka': html = replaceWyliczankaSpecific(html, lang); break;
    case '/druzyny': html = replaceDruzynySpecific(html, lang); break;
    case '/kolejnosc': html = replaceKolejnoscSpecific(html, lang); break;
    case '/liczba': html = replaceLiczbaSpecific(html, lang); break;
    case '/kolor': html = replaceKolorSpecific(html, lang); break;
    case '/': html = replaceIndexSpecific(html, lang); break;
  }
  
  // 17. Add language switcher
  html = addLangSwitcher(html, lang, filename);
  
  // 18. Remove legacy i18n scripts (not needed for static language versions)
  html = html.replace(/\s*<script src="\/js\/translations\.js"[^>]*><\/script>\s*/g, '\n');
  html = html.replace(/\s*<script src="\/js\/i18n\.js"[^>]*><\/script>\s*/g, '\n');
  html = html.replace(/\s*<script src="\/js\/apply_translations\.js"[^>]*><\/script>\s*/g, '\n');
  
  return html;
}


// ============ BUILD EXECUTION ============

function build() {
  console.log('=== Losownik.pl i18n Build ===\n');
  let totalFiles = 0;
  
  for (const lang of LANGUAGES) {
    const langDir = path.join(__dirname, lang);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
    
    for (const filename of PAGES) {
      try {
        const result = processFile(filename, lang);
        if (result) {
          const outPath = path.join(langDir, filename);
          fs.writeFileSync(outPath, result, 'utf8');
          totalFiles++;
        }
      } catch (err) {
        warn(`Error processing ${lang}/${filename}: ${err.message}`);
      }
    }
    console.log(`  ✓ ${lang}/ - ${PAGES.length} files generated`);
  }
  
  console.log(`\n✅ Total: ${totalFiles} files generated across ${LANGUAGES.length} languages`);
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} warnings:`);
    // Show first 20 warnings
    warnings.slice(0, 20).forEach(w => console.log(`   - ${w}`));
    if (warnings.length > 20) console.log(`   ... and ${warnings.length - 20} more`);
  }
  
  return totalFiles;
}

build();


// ============ ADDITIONAL TEXT PATCHES ============
// Apply after main build to catch remaining Polish texts

const EXTRA_PATCHES = {
  en: {
    'Wybór kostki': 'Dice selection',
    'Wybór dyscypliny': 'Sport selection',
    'Kliknij przycisk aby wylosować kolor': 'Click the button to generate a color',
    'Kliknij aby skopiować': 'Click to copy',
    'Kliknij przycisk aby wylosować liczby': 'Click the button to generate numbers',
    'Kliknij przycisk aby wygenerować postać': 'Click the button to generate a character',
    'Kliknij przycisk aby wylosować': 'Click the button to generate',
    'Jak skopiować kod koloru?': 'How to copy the color code?',
    'Kliknij na pole z kodem HEX, RGB lub HSL – zostanie automatycznie skopiowany do schowka.': 'Click on the HEX, RGB or HSL code field – it will be automatically copied to clipboard.',
  },
  de: {
    'Wybór kostki': 'Würfelauswahl',
    'Wybór dyscypliny': 'Sportauswahl',
    'Kliknij przycisk aby wylosować kolor': 'Klicke den Button um eine Farbe zu generieren',
    'Kliknij aby skopiować': 'Klicken zum Kopieren',
    'Kliknij przycisk aby wylosować liczby': 'Klicke den Button um Zahlen zu generieren',
    'Kliknij przycisk aby wygenerować postać': 'Klicke den Button um einen Charakter zu generieren',
    'Kliknij przycisk aby wylosować': 'Klicke den Button zum Generieren',
    'Jak skopiować kod koloru?': 'Wie kopiere ich den Farbcode?',
    'Kliknij na pole z kodem HEX, RGB lub HSL – zostanie automatycznie skopiowany do schowka.': 'Klicke auf das HEX-, RGB- oder HSL-Feld – es wird automatisch in die Zwischenablage kopiert.',
  },
  es: {
    'Wybór kostki': 'Selección de dados',
    'Wybór dyscypliny': 'Selección de deporte',
    'Kliknij przycisk aby wylosować kolor': 'Haz clic en el botón para generar un color',
    'Kliknij aby skopiować': 'Clic para copiar',
    'Kliknij przycisk aby wylosować liczby': 'Haz clic para generar números',
    'Kliknij przycisk aby wygenerować postać': 'Haz clic para generar un personaje',
    'Kliknij przycisk aby wylosować': 'Haz clic para generar',
    'Jak skopiować kod koloru?': '¿Cómo copiar el código de color?',
    'Kliknij na pole z kodem HEX, RGB lub HSL – zostanie automatycznie skopiowany do schowka.': 'Haz clic en el campo HEX, RGB o HSL – se copiará automáticamente al portapapeles.',
  },
  fr: {
    'Wybór kostki': 'Sélection des dés',
    'Wybór dyscypliny': 'Choix du sport',
    'Kliknij przycisk aby wylosować kolor': 'Cliquez sur le bouton pour générer une couleur',
    'Kliknij aby skopiować': 'Cliquez pour copier',
    'Kliknij przycisk aby wylosować liczby': 'Cliquez pour générer des nombres',
    'Kliknij przycisk aby wygenerować postać': 'Cliquez pour générer un personnage',
    'Kliknij przycisk aby wylosować': 'Cliquez pour générer',
    'Jak skopiować kod koloru?': 'Comment copier le code couleur ?',
    'Kliknij na pole z kodem HEX, RGB lub HSL – zostanie automatycznie skopiowany do schowka.': 'Cliquez sur le champ HEX, RGB ou HSL – il sera automatiquement copié dans le presse-papiers.',
  },
  it: {
    'Wybór kostki': 'Selezione dadi',
    'Wybór dyscypliny': 'Scelta dello sport',
    'Kliknij przycisk aby wylosować kolor': 'Clicca il pulsante per generare un colore',
    'Kliknij aby skopiować': 'Clicca per copiare',
    'Kliknij przycisk aby wylosować liczby': 'Clicca per generare numeri',
    'Kliknij przycisk aby wygenerować postać': 'Clicca per generare un personaggio',
    'Kliknij przycisk aby wylosować': 'Clicca per generare',
    'Jak skopiować kod koloru?': 'Come copiare il codice colore?',
    'Kliknij na pole z kodem HEX, RGB lub HSL – zostanie automatycznie skopiowany do schowka.': 'Clicca sul campo HEX, RGB o HSL – verrà copiato automaticamente negli appunti.',
  },
  pt: {
    'Wybór kostki': 'Seleção de dados',
    'Wybór dyscypliny': 'Seleção de esporte',
    'Kliknij przycisk aby wylosować kolor': 'Clique no botão para gerar uma cor',
    'Kliknij aby skopiować': 'Clique para copiar',
    'Kliknij przycisk aby wylosować liczby': 'Clique para gerar números',
    'Kliknij przycisk aby wygenerować postać': 'Clique para gerar um personagem',
    'Kliknij przycisk aby wylosować': 'Clique para gerar',
    'Jak skopiować kod koloru?': 'Como copiar o código de cor?',
    'Kliknij na pole z kodem HEX, RGB lub HSL – zostanie automatycznie skopiowany do schowka.': 'Clique no campo HEX, RGB ou HSL – será copiado automaticamente para a área de transferência.',
  },
  ru: {
    'Wybór kostki': 'Выбор кубика',
    'Wybór dyscypliny': 'Выбор спорта',
    'Kliknij przycisk aby wylosować kolor': 'Нажмите кнопку чтобы сгенерировать цвет',
    'Kliknij aby skopiować': 'Нажмите для копирования',
    'Kliknij przycisk aby wylosować liczby': 'Нажмите чтобы сгенерировать числа',
    'Kliknij przycisk aby wygenerować postać': 'Нажмите чтобы сгенерировать персонажа',
    'Kliknij przycisk aby wylosować': 'Нажмите чтобы сгенерировать',
    'Jak skopiować kod koloru?': 'Как скопировать код цвета?',
    'Kliknij na pole z kodem HEX, RGB lub HSL – zostanie automatycznie skopiowany do schowka.': 'Нажмите на поле с кодом HEX, RGB или HSL – он будет автоматически скопирован в буфер обмена.',
  },
  cs: {
    'Wybór kostki': 'Výběr kostky',
    'Wybór dyscypliny': 'Výběr sportu',
    'Kliknij przycisk aby wylosować kolor': 'Klikněte na tlačítko pro vygenerování barvy',
    'Kliknij aby skopiować': 'Klikněte pro zkopírování',
    'Kliknij przycisk aby wylosować liczby': 'Klikněte pro vygenerování čísel',
    'Kliknij przycisk aby wygenerować postać': 'Klikněte pro vygenerování postavy',
    'Kliknij przycisk aby wylosować': 'Klikněte pro vygenerování',
    'Jak skopiować kod koloru?': 'Jak zkopírovat kód barvy?',
    'Kliknij na pole z kodem HEX, RGB lub HSL – zostanie automatycznie skopiowany do schowka.': 'Klikněte na pole s kódem HEX, RGB nebo HSL – bude automaticky zkopírován do schránky.',
  },
  uk: {
    'Wybór kostki': 'Вибір кубика',
    'Wybór dyscypliny': 'Вибір спорту',
    'Kliknij przycisk aby wylosować kolor': 'Натисніть кнопку щоб згенерувати колір',
    'Kliknij aby skopiować': 'Натисніть для копіювання',
    'Kliknij przycisk aby wylosować liczby': 'Натисніть щоб згенерувати числа',
    'Kliknij przycisk aby wygenerować postać': 'Натисніть щоб згенерувати персонажа',
    'Kliknij przycisk aby wylosować': 'Натисніть щоб згенерувати',
    'Jak skopiować kod koloru?': 'Як скопіювати код кольору?',
    'Kliknij na pole z kodem HEX, RGB lub HSL – zostanie automatycznie skopiowany do schowka.': 'Натисніть на поле з кодом HEX, RGB або HSL – він буде автоматично скопійований у буфер обміну.',
  }
};

// Post-process: apply extra patches to all generated files
function applyExtraPatches() {
  for (const lang of LANGUAGES) {
    const patches = EXTRA_PATCHES[lang];
    if (!patches) continue;
    const langDir = path.join(__dirname, lang);
    for (const filename of PAGES) {
      const filePath = path.join(langDir, filename);
      if (!fs.existsSync(filePath)) continue;
      let html = fs.readFileSync(filePath, 'utf8');
      let changed = false;
      for (const [pl, translated] of Object.entries(patches)) {
        if (html.includes(pl)) {
          html = html.split(pl).join(translated);
          changed = true;
        }
      }
      if (changed) fs.writeFileSync(filePath, html, 'utf8');
    }
  }
  console.log('\n✓ Extra patches applied');
}

applyExtraPatches();
