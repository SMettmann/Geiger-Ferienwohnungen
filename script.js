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





// Expand Smoobu iframe when focus enters the embedded booking form
(function(){
  const activateSmoobuFrame=()=>{
    const active=document.activeElement;
    if(!active || active.tagName!=='IFRAME')return;

    const shell=active.closest('.direct-booking-native');
    if(!shell)return;

    shell.classList.add('smoobu-active');
  };

  // Clicking inside a cross-origin iframe moves focus to the iframe element
  // in the parent page. The parent window emits blur at that moment.
  window.addEventListener('blur',()=>{
    setTimeout(activateSmoobuFrame,0);
  });

  // Fallback for browsers that expose iframe focus directly.
  document.addEventListener('focusin',event=>{
    if(event.target?.tagName==='IFRAME'){
      const shell=event.target.closest('.direct-booking-native');
      shell?.classList.add('smoobu-active');
    }
  });
})();
