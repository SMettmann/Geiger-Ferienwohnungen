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



// Stabilize Smoobu iframe height without trapping large empty space
function stabilizeSmoobuIframe(targetSelector){
  const target=document.querySelector(targetSelector);
  if(!target)return;

  const bindIframe=(iframe)=>{
    if(!iframe || iframe.dataset.heightStabilized==='true')return;
    iframe.dataset.heightStabilized='true';

    let stableHeight=0;
    let scheduled=false;
    const jitterTolerance=70;

    const requestedHeight=()=>{
      const inlineHeight=parseFloat(iframe.style.height);
      if(Number.isFinite(inlineHeight) && inlineHeight>0)return Math.ceil(inlineHeight);

      const attributeHeight=parseFloat(iframe.getAttribute('height'));
      if(Number.isFinite(attributeHeight) && attributeHeight>0)return Math.ceil(attributeHeight);

      return Math.ceil(iframe.getBoundingClientRect().height || 0);
    };

    const stabilize=()=>{
      scheduled=false;
      const next=requestedHeight();
      if(!next)return;

      if(!stableHeight){
        stableHeight=next;
        iframe.style.minHeight=stableHeight+'px';
        return;
      }

      const difference=Math.abs(next-stableHeight);

      // Ignore only tiny Smoobu hover/layout fluctuations.
      if(difference<=jitterTolerance){
        iframe.style.minHeight=stableHeight+'px';
        return;
      }

      // Real booking-step changes may grow OR shrink.
      stableHeight=next;
      iframe.style.minHeight=stableHeight+'px';
    };

    const schedule=()=>{
      if(scheduled)return;
      scheduled=true;
      requestAnimationFrame(stabilize);
    };

    const heightObserver=new MutationObserver(schedule);
    heightObserver.observe(iframe,{
      attributes:true,
      attributeFilter:['style','height']
    });

    iframe.addEventListener('load',()=>{
      setTimeout(schedule,80);
      setTimeout(schedule,350);
    });

    schedule();
  };

  const findIframe=()=>bindIframe(target.querySelector('iframe'));
  findIframe();

  const childObserver=new MutationObserver(findIframe);
  childObserver.observe(target,{childList:true,subtree:true});
}

stabilizeSmoobuIframe('#apartmentIframeKilchbergSearch');
stabilizeSmoobuIframe('#apartmentIframeChurwaldenSearch');
