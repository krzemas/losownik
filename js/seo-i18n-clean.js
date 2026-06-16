(function(){
  function clean(){
    var header=document.querySelector('header');
    if(!header) return;
    header.querySelectorAll('select').forEach(function(select){
      if(!select.classList.contains('lang-select')){
        var parent=select.parentElement;
        if(parent) parent.remove(); else select.remove();
      }
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',clean); else clean();
})();
