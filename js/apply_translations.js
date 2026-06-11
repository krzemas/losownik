// Apply full page translations
(function(){
    var K="losownik_lang",lang=localStorage.getItem(K)||"pl";
    if(lang==="pl"||!window.LOSOWNIK_T) return;
    var path=location.pathname.replace(/\.html$/,"").replace(/\/$/,"")||"/";
    if(path==="/index") path="/";
    var page=window.LOSOWNIK_T[path];
    if(!page||!page[lang]) return;
    var d=page[lang];

    // H1
    if(d.h1){
        var h1=document.querySelector(".page-title");
        if(h1) h1.innerHTML=d.h1;
        var heroH=document.querySelector(".hero h2");
        if(heroH) heroH.innerHTML=d.h1;
    }
    // Description
    if(d.desc){
        var desc=document.querySelector(".page-desc");
        if(desc) desc.textContent=d.desc;
        var heroP=document.querySelector(".hero p");
        if(heroP) heroP.textContent=d.desc;
    }
    // Button
    if(d.btn){
        document.querySelectorAll(".generate-btn,.roll-btn,.flip-btn,.spin-btn").forEach(function(b){
            var t=b.textContent.trim();
            var emoji=t.substring(0,2);
            b.textContent=emoji+" "+d.btn;
        });
    }
    // Hero section for homepage
    if(d.hero){
        var heroH2=document.querySelector(".hero h2");
        if(heroH2) heroH2.innerHTML=d.hero;
    }
    if(d.heroDesc){
        var heroP2=document.querySelector(".hero p");
        if(heroP2) heroP2.textContent=d.heroDesc;
    }
    // Tool cards on homepage
    if(d.cards){
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
    // Sport buttons (mecz page)
    if(d.sports){
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
    // Type buttons (imie page)
    if(d.types){
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
    // Labels
    if(d.label){
        var lbl=document.querySelector(".input-label,label[for],.dice-options-label,.wheel-settings label");
        if(lbl) lbl.textContent=d.label;
    }
    if(d.hint){
        var hint=document.querySelector(".dice-tap-hint,.card-hint,.coin-tap-hint");
        if(hint) hint.textContent=d.hint;
    }
    if(d.opts){
        var opts=document.querySelector(".dice-options-label");
        if(opts) opts.textContent=d.opts;
    }
    // Current dice label
    if(d.label){
        var dl=document.getElementById("currentDiceLabel");
        if(dl&&d.label) dl.textContent=d.label;
    }

    document.documentElement.lang=lang;
})();
