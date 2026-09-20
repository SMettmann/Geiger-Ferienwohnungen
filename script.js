const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
menuButton?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded',String(open));
});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.getElementById('year').textContent=new Date().getFullYear();

const galleries={
  kilchberg:[
    ['https://a0.muscache.com/im/pictures/hosting/Hosting-1640774749513849269/original/aaef4c64-34a1-4601-b5ea-7457669fb338.jpeg?im_w=1200','Wohnbereich'],
    ['https://a0.muscache.com/im/pictures/hosting/Hosting-1640774749513849269/original/45ea1953-9627-4e41-840e-2433be61feb4.jpeg?im_w=1200','Essbereich'],
    ['https://a0.muscache.com/im/pictures/hosting/Hosting-1640774749513849269/original/2455e184-3d05-4c2d-9c07-9c8064c618d5.jpeg?im_w=1200','Küche'],
    ['https://a0.muscache.com/im/pictures/hosting/Hosting-1640774749513849269/original/41b3c36f-6c76-4afd-8bdb-e488a646fff0.png?im_w=1440','Schlafzimmer mit Seeblick'],
    ['https://a0.muscache.com/im/pictures/hosting/Hosting-1640774749513849269/original/4b0a0c6d-473b-46a3-9b7b-62c8b3e9e60a.jpeg?im_w=1200','Weiteres Schlafzimmer']
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


// Lazy Smoobu booking
let smoobuBookingScriptPromise;

function ensureSmoobuBookingScript(){
  if(window.BookingToolIframe) return Promise.resolve();

  if(!smoobuBookingScriptPromise){
    smoobuBookingScriptPromise=new Promise((resolve,reject)=>{
      const existing=document.querySelector('script[data-smoobu-booking-script]');
      if(existing){
        existing.addEventListener('load',resolve,{once:true});
        existing.addEventListener('error',reject,{once:true});
        return;
      }

      const scriptTag=document.createElement('script');
      scriptTag.src='https://login.smoobu.com/js/Settings/BookingToolIframe.js';
      scriptTag.dataset.smoobuBookingScript='true';
      scriptTag.addEventListener('load',resolve,{once:true});
      scriptTag.addEventListener('error',reject,{once:true});
      document.head.appendChild(scriptTag);
    });
  }

  return smoobuBookingScriptPromise;
}

document.querySelectorAll('[data-smoobu-toggle]').forEach(button=>{
  button.addEventListener('click',async()=>{
    const panelId=button.getAttribute('aria-controls');
    const panel=document.getElementById(panelId);
    if(!panel) return;

    const isOpen=button.getAttribute('aria-expanded')==='true';

    if(isOpen){
      panel.hidden=true;
      button.setAttribute('aria-expanded','false');
      button.textContent='Verfügbarkeit & Preis prüfen';
      return;
    }

    panel.hidden=false;
    button.setAttribute('aria-expanded','true');
    button.textContent='Buchung schließen';

    if(button.dataset.smoobuLoaded==='true' || button.dataset.smoobuLoaded==='loading') return;

    button.dataset.smoobuLoaded='loading';

    try{
      await ensureSmoobuBookingScript();
      BookingToolIframe.initialize({
        url:button.dataset.smoobuUrl,
        baseUrl:'https://login.smoobu.com',
        target:button.dataset.smoobuTarget
      });
      button.dataset.smoobuLoaded='true';
    }catch(error){
      button.dataset.smoobuLoaded='false';
      button.textContent='Erneut versuchen';
      console.error('Smoobu Buchungssystem konnte nicht geladen werden.',error);
    }
  });
});
