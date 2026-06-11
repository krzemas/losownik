// Apply page content translations from LOSOWNIK_T
(function(){
    var K="losownik_lang", lang=localStorage.getItem(K)||"pl";
    if(lang==="pl"||!window.LOSOWNIK_T) return;
    var path=location.pathname.replace(/\.html$/,"").replace(/\/$/,"");
    if(!path||path==="/index") path="/";
    var t=window.LOSOWNIK_T[path];
    if(!t||!t[lang]) return;
    var d=t[lang];
    // Translate H1
    if(d.h1){
        var h=document.querySelector(".page-title");
        if(h) h.innerHTML="<span>"+d.h1+"</span>";
        var heroH=document.querySelector(".hero h2");
        if(heroH) heroH.innerHTML="<span>"+d.h1+"</span>";
    }
    // Translate description
    if(d.desc){
        var p=document.querySelector(".page-desc");
        if(p) p.textContent=d.desc;
        var heroP=document.querySelector(".hero p");
        if(heroP) heroP.textContent=d.desc;
    }
    // Translate main button
    if(d.btn){
        var btns=document.querySelectorAll(".generate-btn,.roll-btn,.flip-btn,.spin-btn");
        btns.forEach(function(b){
            var txt=b.textContent.trim();
            var emoji=txt.match(/^[\u{1F000}-\u{1FFFF}|\u{2600}-\u{27FF}|\u{FE00}-\u{FEFF}|\u{1F900}-\u{1F9FF}|\u{2694}|\u{26BD}]/u);
            b.textContent=(emoji?emoji[0]+" ":"")+d.btn;
        });
    }
})();
