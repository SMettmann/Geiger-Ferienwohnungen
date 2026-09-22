(function(){
  const pairs={
    "impressum.html":"impressum-en.html",
    "datenschutz.html":"datenschutz-en.html",
    "agb.html":"agb-en.html"
  };
  const reverse=Object.fromEntries(Object.entries(pairs).map(([de,en])=>[en,de]));
  const current=(location.pathname.split("/").pop()||"").toLowerCase();
  const currentLang=current.endsWith("-en.html")?"en":"de";
  const saved=localStorage.getItem("staywithus-language");

  if(saved==="en" && pairs[current]){
    location.replace(pairs[current]+location.search+location.hash);
    return;
  }
  if(saved==="de" && reverse[current]){
    location.replace(reverse[current]+location.search+location.hash);
    return;
  }

  document.documentElement.lang=currentLang;

  const header=document.querySelector(".legal-header");
  const back=document.querySelector(".legal-back");
  if(header && back){
    const actions=document.createElement("div");
    actions.className="legal-header-actions";

    const switcher=document.createElement("div");
    switcher.className="legal-language-switch";
    switcher.setAttribute("aria-label",currentLang==="en"?"Choose language":"Sprache wählen");

    const deTarget=reverse[current]||current;
    const enTarget=pairs[current]||current;

    const de=document.createElement("a");
    de.href=deTarget;
    de.textContent="DE";
    de.className="legal-language-option"+(currentLang==="de"?" is-active":"");
    de.setAttribute("aria-current",currentLang==="de"?"page":"false");
    de.addEventListener("click",()=>localStorage.setItem("staywithus-language","de"));

    const sep=document.createElement("span");
    sep.textContent="/";
    sep.setAttribute("aria-hidden","true");

    const en=document.createElement("a");
    en.href=enTarget;
    en.textContent="EN";
    en.className="legal-language-option"+(currentLang==="en"?" is-active":"");
    en.setAttribute("aria-current",currentLang==="en"?"page":"false");
    en.addEventListener("click",()=>localStorage.setItem("staywithus-language","en"));

    switcher.append(de,sep,en);
    back.textContent=currentLang==="en"?"Back to homepage":"Zurück zur Startseite";
    actions.append(switcher,back);
    header.append(actions);
  }
})();