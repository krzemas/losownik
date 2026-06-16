/**
 * Losownik.pl - Enhanced Translation Applier v4
 * Handles ALL page elements: meta, title, FAQ, JSON-LD, footer,
 * breadcrumbs, dice names, score labels, hints, buttons, etc.
 */
(function(){
'use strict';
var K="losownik_lang";
var lang=localStorage.getItem(K)||"pl";
if(lang==="pl") return;
if(!window.LOSOWNIK_T||!window.LOSOWNIK_META||!window.LOSOWNIK_COMMON) return;
var C=window.LOSOWNIK_COMMON[lang];
if(!C) return;


// Determine current page path
var path=location.pathname.replace(/\.html$/,"").replace(/\/$/,"")||"/";
if(path==="/index") path="/";

var meta=window.LOSOWNIK_META[path];
var page=window.LOSOWNIK_T[path];
var d=page&&page[lang]?page[lang]:null;
var m=meta&&meta[lang]?meta[lang]:null;

// === 1. META: title + description ===
if(m){
    if(m.title) document.title=m.title;
    var metaDesc=document.querySelector('meta[name="description"]');
    if(metaDesc&&m.desc) metaDesc.setAttribute("content",m.desc);
}

// === 2. PAGE TITLE (h1) ===
if(d&&d.h1){
    var h1=document.querySelector(".page-title");
    if(h1) h1.innerHTML=d.h1;
    var heroH=document.querySelector(".hero h2");
    if(heroH&&d.hero) heroH.innerHTML=d.hero;
    else if(heroH&&path==="/") heroH.innerHTML=d.h1;
}
// Hero section for homepage
if(d&&d.hero){
    var heroH2=document.querySelector(".hero h2");
    if(heroH2) heroH2.innerHTML=d.hero;
}
if(d&&d.heroDesc){
    var heroP=document.querySelector(".hero p");
    if(heroP) heroP.textContent=d.heroDesc;
}

// === 3. PAGE DESCRIPTION ===
if(d&&d.desc){
    var descEl=document.querySelector(".page-desc");
    if(descEl) descEl.textContent=d.desc;
}


// === 4. BUTTONS ===
if(d&&d.btn){
    document.querySelectorAll(".generate-btn,.roll-btn,.flip-btn,.spin-btn").forEach(function(b){
        var t=b.textContent.trim();
        // Preserve emoji (first 1-2 chars before space)
        var parts=t.split(" ");
        var emoji="";
        if(parts.length>1&&parts[0].length<=2) emoji=parts[0]+" ";
        b.textContent=emoji+d.btn;
    });
}

// === 5. HOMEPAGE TOOL CARDS ===
if(d&&d.cards){
    var cards=document.querySelectorAll(".tool-card");
    var cardKeys=["kostka","mecz","imie","lotto","wyliczanka","liczba","kolo","kolor","druzyny","kolejnosc","postac","moneta","karty"];
    cards.forEach(function(card,i){
        var key=cardKeys[i];
        if(key&&d.cards[key]){
            var h3=card.querySelector("h3");
            if(h3) h3.textContent=d.cards[key];
            var p=card.querySelector("p");
            if(p&&d.cards[key+"Sub"]) p.textContent=d.cards[key+"Sub"];
        }
    });
}

// === 6. SPORT BUTTONS (mecz page) ===
if(d&&d.sports){
    document.querySelectorAll(".sport-btn").forEach(function(btn){
        var nodes=btn.childNodes;
        for(var i=nodes.length-1;i>=0;i--){
            if(nodes[i].nodeType===3){
                var txt=nodes[i].textContent.trim();
                if(d.sports[txt]) nodes[i].textContent=d.sports[txt];
                break;
            }
        }
    });
}

// === 7. TYPE BUTTONS (imie page) ===
if(d&&d.types){
    document.querySelectorAll(".type-btn").forEach(function(btn){
        var nodes=btn.childNodes;
        for(var i=nodes.length-1;i>=0;i--){
            if(nodes[i].nodeType===3){
                var txt=nodes[i].textContent.trim();
                if(d.types[txt]) nodes[i].textContent=" "+d.types[txt];
                break;
            }
        }
    });
}


// === 8. LABELS, HINTS, OPTIONS ===
if(d&&d.label){
    var lbl=document.querySelector(".input-label,label[for],.wheel-settings label,.dice-options-label");
    if(lbl) lbl.textContent=d.label;
    var dl=document.getElementById("currentDiceLabel");
    if(dl) dl.textContent=d.label;
}
if(d&&d.hint){
    var hint=document.querySelector(".dice-tap-hint,.card-hint,.coin-tap-hint");
    if(hint) hint.textContent=d.hint;
}
if(d&&d.opts){
    var opts=document.querySelector(".dice-options-label");
    if(opts) opts.textContent=d.opts;
}

// === 9. DICE NAMES (kostka page) ===
if(d&&d.diceNames){
    // Update the currentDiceLabel based on active dice
    var activeDice=document.querySelector(".dice-btn.active");
    if(activeDice){
        var sides=activeDice.dataset.sides;
        var dl2=document.getElementById("currentDiceLabel");
        if(dl2&&d.diceNames[sides]) dl2.textContent=d.diceNames[sides];
    }
    // Update dice button labels
    if(d.diceLabels){
        document.querySelectorAll(".dice-btn").forEach(function(btn){
            var s=btn.dataset.sides;
            var lbl2=btn.querySelector(".dice-label");
            if(lbl2&&d.diceLabels[s]) lbl2.textContent=d.diceLabels[s];
        });
    }
}

// === 10. RESULT LABEL (kostka page) ===
var resultLabel=document.getElementById("resultLabel");
if(resultLabel&&C.clickToRoll){
    if(resultLabel.textContent.indexOf("Kliknij")>=0) resultLabel.textContent=C.clickToRoll;
}

// === 11. HISTORY SECTION ===
var historyH3=document.querySelector(".history h3");
if(historyH3&&C.history) historyH3.textContent=C.history;
var historyEmpty=document.querySelector(".history-empty");
if(historyEmpty&&C.noHistory) historyEmpty.textContent=C.noHistory;


// === 12. COIN PAGE: Stats labels ===
var headsLbl=document.querySelectorAll(".stat-label");
if(headsLbl.length>=3&&C.headsLabel){
    headsLbl[0].textContent=C.headsLabel;
    headsLbl[1].textContent=C.tailsLabel;
    headsLbl[2].textContent=C.totalLabel;
}
var coinHint=document.querySelector(".coin-tap-hint");
if(coinHint&&d&&d.hint) coinHint.textContent=d.hint;

// === 13. MATCH PAGE: Team labels + score detail ===
var hostLabel=document.querySelector(".team-label");
var guestLabel=document.querySelectorAll(".team-label")[1];
if(hostLabel&&C.hostLabel) hostLabel.textContent=C.hostLabel;
if(guestLabel&&C.guestLabel) guestLabel.textContent=C.guestLabel;
var scoreDetail=document.getElementById("scoreDetail");
if(scoreDetail&&C.clickToGenerate&&scoreDetail.textContent.indexOf("Kliknij")>=0){
    scoreDetail.textContent=C.clickToGenerate;
}

// === 14. LOTTO PAGE: Game info + result label ===
if(d&&d.games){
    var lottoResultLabel=document.getElementById("resultLabel");
    if(lottoResultLabel){
        // Update on load based on current active game
        var activeGame=document.querySelector(".game-btn.active");
        if(activeGame){
            var gKey=activeGame.dataset.game;
            if(d.games[gKey]){
                lottoResultLabel.textContent=(activeGame.textContent.split("\n")[0].trim())+" – "+d.games[gKey];
            }
        }
    }
    var lottoInfo=document.getElementById("lottoInfo");
    if(lottoInfo&&C.clickNumbers&&lottoInfo.textContent.indexOf("Kliknij")>=0){
        lottoInfo.textContent=C.clickNumbers;
    }
}

// === 15. WHEEL PAGE: Settings hint + placeholder ===
var settingsHint=document.querySelector(".settings-hint");
if(settingsHint&&C.settingsHint) settingsHint.textContent=C.settingsHint;

// === 16. NAME PAGE: Display placeholder ===
var nameDisplay=document.querySelector(".name-display.placeholder");
if(nameDisplay&&C.clickName&&nameDisplay.textContent.indexOf("Kliknij")>=0){
    nameDisplay.textContent=C.clickName;
}

// === 17. NUMBER PAGE: Labels ===
var minLbl=document.querySelector('label[for="minVal"]');
var maxLbl=document.querySelector('label[for="maxVal"]');
var countLbl=document.querySelector('label[for="countVal"]');
if(minLbl&&C.minLabel) minLbl.textContent=C.minLabel;
if(maxLbl&&C.maxLabel) maxLbl.textContent=C.maxLabel;
if(countLbl&&C.countLabel) countLbl.textContent=C.countLabel;

// === 18. TEAMS PAGE: Labels ===
var playersLbl=document.querySelector('label[for="playersArea"],.players-label');
if(playersLbl&&C.playersLabel) playersLbl.textContent=C.playersLabel;
var teamsLbl=document.querySelector('label[for="teamsCount"],.teams-label');
if(teamsLbl&&C.teamsLabel) teamsLbl.textContent=C.teamsLabel;

// === 19. ORDER PAGE: Label ===
var itemsLbl=document.querySelector('label[for="itemsArea"],.items-label');
if(itemsLbl&&C.itemsLabel) itemsLbl.textContent=C.itemsLabel;


// === 20. BREADCRUMB ===
var breadcrumb=document.querySelector(".breadcrumb");
if(breadcrumb&&C.home){
    var links=breadcrumb.querySelectorAll("a");
    if(links.length>0&&links[0].textContent.trim()==="Strona główna"){
        links[0].textContent=C.home;
    }
    // Translate page name in breadcrumb (last text node)
    var lastText=breadcrumb.lastChild;
    if(lastText&&lastText.nodeType===3&&d&&d.h1){
        var cleanH1=d.h1.replace(/<[^>]*>/g,"");
        lastText.textContent=cleanH1;
    }
}

// === 21. FOOTER ===
var footer=document.querySelector("footer p");
if(footer&&C.home){
    var footerLinks=footer.querySelectorAll("a");
    footerLinks.forEach(function(a){
        if(a.textContent.trim()==="Strona główna") a.textContent=C.home;
        if(a.textContent.trim()==="Polityka prywatności") a.textContent=C.privacy;
    });
    // Update subtitle text in footer if present
    var footerText=footer.innerHTML;
    if(footerText.indexOf("Internetowa maszyna losująca")>=0){
        footer.innerHTML=footerText.replace("Internetowa maszyna losująca",C.footer);
    }
}

// === 22. LOGO SUBTITLE ===
var logoSub=document.querySelector(".logo-subtitle");
if(logoSub&&C.subtitle) logoSub.textContent=C.subtitle;

// === 23. FAQ SECTION ===
if(d&&d.faq&&d.faq.length>0){
    var faqSection=document.querySelector(".faq");
    if(faqSection){
        var faqH2=faqSection.querySelector("h2");
        if(faqH2&&C.faq) faqH2.textContent=C.faq;
        var faqItems=faqSection.querySelectorAll(".faq-item");
        d.faq.forEach(function(item,i){
            if(faqItems[i]){
                var h4=faqItems[i].querySelector("h4");
                var p=faqItems[i].querySelector("p");
                if(h4) h4.textContent=item.q;
                if(p) p.textContent=item.a;
            }
        });
    }
}else if(C.faq){
    // At minimum translate the FAQ heading
    var faqH2b=document.querySelector(".faq h2");
    if(faqH2b) faqH2b.textContent=C.faq;
}


// === 24. JSON-LD STRUCTURED DATA ===
var ldScript=document.querySelector('script[type="application/ld+json"]');
if(ldScript&&d&&d.faq&&d.faq.length>0){
    try{
        var ld=JSON.parse(ldScript.textContent);
        if(ld["@type"]==="FAQPage"&&ld.mainEntity){
            ld.mainEntity=d.faq.map(function(item){
                return {"@type":"Question","name":item.q,"acceptedAnswer":{"@type":"Answer","text":item.a}};
            });
            ldScript.textContent=JSON.stringify(ld);
        }
        if(ld["@type"]==="WebApplication"&&m){
            if(m.desc) ld.description=m.desc;
            ldScript.textContent=JSON.stringify(ld);
        }
    }catch(e){}
}

// === 25. SET HTML LANG ATTRIBUTE ===
document.documentElement.lang=lang;

// === 26. OVERRIDE JS-GENERATED STRINGS ===
// Monkey-patch for dynamic content that gets generated after page load
window._losownikLang=lang;
window._losownikCommon=C;
window._losownikPage=d;

})();
