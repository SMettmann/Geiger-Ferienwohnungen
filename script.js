// Always start at the top after reload/navigation restoration
if('scrollRestoration' in history){
  history.scrollRestoration='manual';
}

const forcePageTop=()=>{
  window.scrollTo(0,0);
};

window.addEventListener('pageshow',()=>{
  forcePageTop();
  requestAnimationFrame(forcePageTop);
  setTimeout(forcePageTop,60);
});

window.addEventListener('load',()=>{
  forcePageTop();
  setTimeout(forcePageTop,120);
});

const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
menuButton?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded',String(open));
});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.getElementById('year').textContent=new Date().getFullYear();

// Brand scroll-to-top without leaving #top in the URL
document.querySelectorAll('.brand[href="#top"]').forEach(brand=>{
  brand.addEventListener('click',event=>{
    event.preventDefault();
    window.scrollTo({top:0,behavior:'smooth'});
    if(location.hash==='#top'){
      history.replaceState(null,'',location.pathname+location.search);
    }
    brand.blur();
  });
});

// If a previous logo click left #top in the address, clean it on reload as well.
if(location.hash==='#top'){
  history.replaceState(null,'',location.pathname+location.search);
  window.scrollTo(0,0);
}

const galleries={
  kilchberg:[
    ['assets/kilchberg-living.webp','Wohnbereich'],
    ['assets/kilchberg-dining.webp','Essbereich'],
    ['assets/kilchberg-kitchen.webp','Küche'],
    ['assets/kilchberg-bedroom-lake.webp','Schlafzimmer mit Seeblick'],
    ['assets/kilchberg-bedroom.webp','Weiteres Schlafzimmer']
  ],
  zurich:[
    ['assets/zurich-studio-main.webp','Studio Gesamtansicht'],
    ['assets/zurich-studio-tv.webp','Studio mit TV und Arbeitsfläche'],
    ['assets/zurich-studio-bed.webp','Schlafbereich'],
    ['assets/zurich-kitchen.webp','Küchenzeile'],
    ['assets/zurich-bath.webp','Duschbad']
  ],
  dietlikon:[
    ['assets/dietlikon-living.webp','Wohn- und Essbereich'],
    ['assets/dietlikon-bedroom-1.webp','Schlafzimmer 1'],
    ['assets/dietlikon-bedroom-2.webp','Schlafzimmer 2'],
    ['assets/dietlikon-kitchen.webp','Küche'],
    ['assets/dietlikon-bath.webp','Badezimmer'],
    ['assets/dietlikon-balcony.webp','Balkon'],
    ['assets/dietlikon-dining.webp','Essbereich']
  ],
  churwalden:[
    ['assets/churwalden-living.webp','Wohnbereich'],
    ['assets/churwalden-bedroom.webp','Familien-Schlafzimmer'],
    ['assets/churwalden-kitchen.webp','Küche und Essbereich'],
    ['assets/churwalden-bath.webp','Badezimmer'],
    ['assets/churwalden-balcony.webp','Balkon']
  ]
};
const dialog=document.getElementById('lightbox');
const dialogImage=document.getElementById('lightbox-image');
const counter=document.getElementById('lightbox-counter');
let active=0;
let activeGallery='kilchberg';
function showImage(index){
  const gallery=galleries[activeGallery];
  active=(index+gallery.length)%gallery.length;
  dialogImage.src=gallery[active][0];
  dialogImage.alt=gallery[active][1];
  counter.textContent=(active+1)+' / '+gallery.length;
}
document.querySelectorAll('[data-gallery]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    activeGallery='kilchberg';
    showImage(Number(btn.dataset.gallery));
    dialog.showModal();
  });
});
document.querySelectorAll('[data-zurich-gallery]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    activeGallery='zurich';
    showImage(Number(btn.dataset.zurichGallery));
    dialog.showModal();
  });
});
document.querySelectorAll('[data-dietlikon-gallery]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    activeGallery='dietlikon';
    showImage(Number(btn.dataset.dietlikonGallery));
    dialog.showModal();
  });
});
document.querySelectorAll('[data-churwalden-gallery]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    activeGallery='churwalden';
    showImage(Number(btn.dataset.churwaldenGallery));
    dialog.showModal();
  });
});
document.querySelector('.lightbox-close')?.addEventListener('click',()=>dialog.close());
document.querySelector('.lightbox-prev')?.addEventListener('click',()=>showImage(active-1));
document.querySelector('.lightbox-next')?.addEventListener('click',()=>showImage(active+1));
dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
document.addEventListener('keydown',e=>{
  if(!dialog?.open)return;
  if(e.key==='ArrowLeft')showImage(active-1);
  if(e.key==='ArrowRight')showImage(active+1);
});







// Keep each Smoobu booking fully isolated in its own local document.
(function(){
  const frames=[...document.querySelectorAll('.smoobu-host-frame')];

  window.addEventListener('message',event=>{
    if(event.origin!==location.origin)return;
    if(event.data?.type!=='smoobu-height')return;

    const frame=frames.find(item=>
      item.dataset.smoobuProperty===String(event.data.property) &&
      item.contentWindow===event.source
    );
    if(!frame)return;

    const next=Math.max(220,Math.min(Number(event.data.height)||220,1800));
    frame.style.height=next+'px';
  });

  // If the visitor clicks outside a booking area, reset only the visual calendar expansion.
  document.addEventListener('pointerdown',event=>{
    if(event.target.closest('.direct-booking-native'))return;

    frames.forEach(frame=>{
      frame.contentWindow?.postMessage({type:'smoobu-reset'},location.origin);
    });
  });
})();


// Contact modal
(function(){
  const dialog=document.getElementById('kontakt');
  const form=document.getElementById('contact-form');
  const status=document.getElementById('contact-form-status');

  document.querySelectorAll('[data-contact-open]').forEach(link=>{
    link.addEventListener('click',event=>{
      event.preventDefault();
      nav?.classList.remove('open');
      menuButton?.setAttribute('aria-expanded','false');
      dialog?.showModal();
    });
  });

  dialog?.querySelector('.contact-dialog-close')?.addEventListener('click',()=>{
    dialog.close();
  });

  dialog?.addEventListener('click',event=>{
    const box=dialog.getBoundingClientRect();
    const outside=
      event.clientX<box.left ||
      event.clientX>box.right ||
      event.clientY<box.top ||
      event.clientY>box.bottom;

    if(outside) dialog.close();
  });

  form?.addEventListener('submit',event=>{
    event.preventDefault();
    if(status){
      status.textContent='Das Formular ist fertig gestaltet. Die Empfängeradresse für den Versand wird noch hinterlegt.';
    }
  });
})();
