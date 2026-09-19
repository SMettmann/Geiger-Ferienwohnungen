const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
menuButton?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded',String(open));
});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.getElementById('year').textContent=new Date().getFullYear();

const gallery=[
  ['https://a0.muscache.com/im/pictures/hosting/Hosting-1640774749513849269/original/aaef4c64-34a1-4601-b5ea-7457669fb338.jpeg?im_w=1200','Wohnbereich'],
  ['https://a0.muscache.com/im/pictures/hosting/Hosting-1640774749513849269/original/45ea1953-9627-4e41-840e-2433be61feb4.jpeg?im_w=1200','Essbereich'],
  ['https://a0.muscache.com/im/pictures/hosting/Hosting-1640774749513849269/original/2455e184-3d05-4c2d-9c07-9c8064c618d5.jpeg?im_w=1200','Küche'],
  ['https://a0.muscache.com/im/pictures/hosting/Hosting-1640774749513849269/original/41b3c36f-6c76-4afd-8bdb-e488a646fff0.png?im_w=1440','Schlafzimmer mit Seeblick'],
  ['https://a0.muscache.com/im/pictures/hosting/Hosting-1640774749513849269/original/4b0a0c6d-473b-46a3-9b7b-62c8b3e9e60a.jpeg?im_w=1200','Weiteres Schlafzimmer']
];
const dialog=document.getElementById('lightbox');
const dialogImage=document.getElementById('lightbox-image');
const counter=document.getElementById('lightbox-counter');
let active=0;
function showImage(index){
  active=(index+gallery.length)%gallery.length;
  dialogImage.src=gallery[active][0];
  dialogImage.alt=gallery[active][1];
  counter.textContent=(active+1)+' / '+gallery.length;
}
document.querySelectorAll('[data-gallery]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    showImage(Number(btn.dataset.gallery));
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
