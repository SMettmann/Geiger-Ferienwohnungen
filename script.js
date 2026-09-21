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

    const measured=Math.max(220,Number(event.data.height)||220);

    // On mobile the final Smoobu booking form can be taller than 1800px.
    // Do not clamp it there, otherwise the last fields / booking button get cut off.
    const next=window.matchMedia('(max-width:760px)').matches
      ? measured
      : Math.min(measured,1800);

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

  form?.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!form.reportValidity())return;

    const submit=form.querySelector('.contact-submit');
    const lang=window.getHomepageLanguage?.()==='en'?'en':'de';
    if(submit)submit.disabled=true;
    if(status)status.textContent=lang==='en'?'Sending…':'Wird gesendet…';

    try{
      const data=new FormData(form);
      data.append('_subject','Neue Anfrage über Stay With Us Homes');
      data.append('_template','table');
      data.append('_captcha','false');

      const response=await fetch('https://formsubmit.co/ajax/info@geigerimmobilien.ch',{
        method:'POST',
        headers:{'Accept':'application/json'},
        body:data
      });

      const result=await response.json().catch(()=>({}));
      if(!response.ok || result.success===false)throw new Error('FormSubmit error');

      form.reset();
      if(status){
        status.textContent=lang==='en'
          ? 'Thank you! Your message has been sent.'
          : 'Vielen Dank! Deine Nachricht wurde gesendet.';
      }
    }catch(error){
      if(status){
        status.textContent=lang==='en'
          ? 'Sending failed. Please try again.'
          : 'Das Senden hat nicht geklappt. Bitte versuche es noch einmal.';
      }
    }finally{
      if(submit)submit.disabled=false;
    }
  });
})();


// Homepage language switcher (Smoobu iframe content intentionally excluded)
(function(){
  const deToEn = new Map(Object.entries({
    "Menü":"Menu","Unterkünfte":"Stays","Über uns":"About us","Kontakt":"Contact",
    "Ankommen.":"Arrive.","Wohlfühlen.":"Feel at home.","Bleiben.":"Stay.",
    "Besondere Unterkünfte für Tage, die sich nicht nach Hotel anfühlen sollen.":"Distinctive stays for days that should feel nothing like a hotel.",
    "Unterkünfte entdecken":"Explore our stays","Kilchberg ansehen":"View Kilchberg","Aktuell im Fokus":"Currently featured","Kilchberg am Zürichsee":"Kilchberg on Lake Zurich",
    "Ein Zuhause auf Zeit.":"A home away from home.","Mit Charakter statt Standard.":"Character instead of standard.",
    "Unsere Unterkünfte verbinden eine unkomplizierte Anreise mit einem persönlichen Wohngefühl. Ob Stadttage in Zürich, Ruhe am See oder Auszeit in den Bergen – jede Wohnung hat ihren eigenen Charakter.":"Our stays combine an easy arrival with the feeling of a personal home. Whether you are spending time in Zurich, relaxing by the lake or escaping to the mountains, every property has its own character.",
    "Praktisch, gemütlich und mit allem, was man für einen entspannten Aufenthalt wirklich braucht.":"Practical, comfortable and equipped with everything you really need for a relaxed stay.",
    "UNSERE UNTERKÜNFTE":"OUR STAYS","Für jeden Aufenthalt.":"For every kind of stay.","Das passende Zuhause.":"The right place to call home.",
    "Von Zürich bis Graubünden – passend für Citytrip, Familie, Business-Aufenthalt oder ein paar ruhige Tage zwischendurch.":"From Zurich to Graubünden – ideal for a city break, family trip, business stay or simply a few quiet days away.",
    "Charmantes Zuhause":"Charming home","nahe Zürich":"near Zurich","See-Blick, Familienkomfort und eigener Außenbereich.":"Lake views, family comfort and private outdoor space.","Unterkunft entdecken":"Explore this stay",
    "Kompakt wohnen.":"Compact living.","Zürich erleben.":"Experience Zurich.","Durchdacht, privat und ideal als eigene Base für Tage in der Stadt.":"Thoughtfully designed, private and ideal as your own base for days in the city.","Studio entdecken":"Explore the studio",
    "Mehr Platz.":"More space.","Kurze Wege.":"Everything close by.","Geräumig wohnen zwischen Zürich, Flughafen und Messe.":"Spacious living between Zurich, the airport and the exhibition centre.",
    "Bergluft.":"Mountain air.","Weitblick. Auszeit.":"Open views. Time out.","Familienfreundlich wohnen zwischen Churwalden und Lenzerheide.":"Family-friendly living between Churwalden and Lenzerheide.",
    "SEEBLICK · ERHOLUNG · FAMILIE":"LAKE VIEW · RELAXATION · FAMILY","Charmantes Haus":"Charming home","mit Blick Richtung See.":"with views towards the lake.",
    "Helle Räume, warme Holzelemente und ein Wohngefühl, das bewusst nicht nach klassischem Apartment aussieht. Dazu kommen ein eigener Außenbereich, eine voll ausgestattete Küche und viel Platz zum gemeinsamen Ankommen.":"Bright rooms, warm wooden details and a homely atmosphere that feels deliberately different from a conventional apartment. Add a private outdoor area, a fully equipped kitchen and plenty of space to settle in together.",
    "Verfügbarkeit prüfen":"Check availability","Bis 8 Gäste":"Up to 8 guests","2 Schlafzimmer · 5 Betten":"2 bedrooms · 5 beds","2 Badezimmer":"2 bathrooms","plus Wasch- & Trockenmöglichkeit":"plus washer & dryer",
    "Familie & Hund":"Family & dog","Haustiere willkommen · Kinder-Ausstattung":"Pets welcome · child-friendly equipment","2 Parkplätze":"2 parking spaces","Self Check-in · Arbeitsplatz · WLAN":"Self check-in · workspace · Wi-Fi",
    "WOHNEN IN KILCHBERG":"STAYING IN KILCHBERG","Altbau-Charme trifft unkomplizierten Komfort.":"Period charm meets effortless comfort.",
    "Der offene Wohn- und Essbereich mit sichtbaren Holzbalken bildet das Herz der Unterkunft. Unterschiedliche Rückzugsorte machen das Haus flexibel – für gemeinsame Abende genauso wie für ruhige Momente.":"The open-plan living and dining area with exposed wooden beams forms the heart of the home. Different spaces to retreat make it flexible – for evenings together as well as quiet moments.",
    "Die Küche ist für längere Aufenthalte ausgelegt. Im Haus stehen außerdem Waschmaschine und Trockner zur Verfügung. Draußen wartet ein geschützter Sitzbereich mit Grillmöglichkeit.":"The kitchen is designed for longer stays, and a washing machine and dryer are also available. Outside, a sheltered seating area with barbecue facilities awaits.",
    "Was dich erwartet":"What to expect","WLAN":"Wi-Fi","Küche":"Kitchen","Kaffeemaschine":"Coffee machine","Waschmaschine":"Washing machine","Trockner":"Dryer","Außenbereich":"Outdoor area","Grill":"Barbecue","Familienbereich":"Family-friendly space","See-Blick":"Lake view","Essbereich":"Dining area","Langzeit-tauglich":"Suitable for longer stays",
    "Die vollständige, jeweils aktuelle Ausstattung wird vor Buchung im Buchungskanal angezeigt.":"The complete and current list of amenities is shown in the booking channel before you book.",
    "Die vollständige und jeweils aktuelle Ausstattung wird vor Buchung im Buchungskanal angezeigt.":"The complete and current list of amenities is shown in the booking channel before you book.",
    "DIREKT BUCHEN · KILCHBERG":"BOOK DIRECT · KILCHBERG","DIREKT BUCHEN · ZÜRICH":"BOOK DIRECT · ZURICH","DIREKT BUCHEN · DIETLIKON":"BOOK DIRECT · DIETLIKON","DIREKT BUCHEN · CHURWALDEN":"BOOK DIRECT · CHURWALDEN","Verfügbarkeit & Preis prüfen.":"Check availability & price.",
    "RUND UM DEINEN AUFENTHALT":"AROUND YOUR STAY","Zürich vor der Tür.":"Zurich on your doorstep.","See und Natur gleich mit.":"With the lake and nature close by.",
    "Kilchberg ist ein ruhiger Ausgangspunkt für Stadt, See und Ausflüge. Die folgenden Highlights geben einen Eindruck davon, was sich rund um den Aufenthalt entdecken lässt.":"Kilchberg is a peaceful base for the city, the lake and day trips. These highlights give you a taste of what there is to discover nearby.",
    "Zürichsee":"Lake Zurich","Spaziergänge am Wasser, Schifffahrt und Alpenblick.":"Waterside walks, boat trips and Alpine views.","Das bekannte Schokoladen-Erlebnis liegt direkt in Kilchberg.":"The famous chocolate experience is located right in Kilchberg.",
    "Zürcher Altstadt":"Zurich Old Town","Cafés, Boutiquen, Restaurants und historische Gassen.":"Cafés, boutiques, restaurants and historic lanes.","Ein schöner Ort für Spaziergänge und Velotouren am See.":"A beautiful spot for walks and bike rides by the lake.","Aussicht, Wanderwege und Natur oberhalb von Zürich.":"Views, hiking trails and nature above Zurich.","Zürich & Umgebung":"Zurich & surroundings","Stadtleben, Bewegung und Aussicht lassen sich einfach verbinden.":"City life, outdoor activity and beautiful views are easy to combine.",
    "STADT · KURZE WEGE · PRIVAT":"CITY · CLOSE BY · PRIVATE","Kompakt. Durchdacht.":"Compact. Thoughtful.","Mitten im Zürich-Gefühl.":"Right in the Zurich experience.",
    "Dieses Studio ist bewusst kompakt geschnitten – und genau darauf ist es eingerichtet. Auf kleinem Raum findest du einen gemütlichen Schlafbereich, eine eigene Küchenzeile, ein privates Duschbad, TV sowie einen kleinen Platz zum Essen oder Arbeiten.":"This studio is intentionally compact – and designed precisely for that. Within a small space you will find a cosy sleeping area, your own kitchenette, a private shower room, TV and a small place to eat or work.",
    "Ideal für Gäste, die tagsüber Zürich entdecken und abends einen unkomplizierten, eigenen Rückzugsort möchten.":"Ideal for guests who want to explore Zurich during the day and return to a simple, private retreat in the evening.",
    "City-Studio":"City studio","kompakt & sinnvoll genutzt":"compact & cleverly designed","Eigene Küchenzeile":"Private kitchenette","Kochfeld, Geschirr & Kaffee":"hob, tableware & coffee","Privates Duschbad":"Private shower room","alles direkt im Studio":"everything inside the studio","Gute Anbindung":"Well connected","Stadt, Tram & Bus schnell erreichbar":"city, tram & bus within easy reach",
    "DEINE BASE IN ZÜRICH":"YOUR BASE IN ZURICH","Weniger Fläche.":"Less space.","Mehr Stadt vor der Tür.":"More city on your doorstep.",
    "Hier soll niemand glauben, er buche ein weitläufiges Apartment. Das Studio ist klein – dafür sauber organisiert und mit den Dingen ausgestattet, die für einen Citytrip oder einen kurzen Business-Aufenthalt zählen.":"This is not a sprawling apartment. The studio is small, but carefully organised and equipped with the things that matter for a city break or short business stay.",
    "Die Küchenzeile ermöglicht kleine Mahlzeiten, die Kaffeeecke sorgt für den schnellen Start in den Tag und der eigene Bereich bleibt komplett privat.":"The kitchenette is ideal for simple meals, the coffee corner gets your day started quickly and the entire space remains completely private.",
    "Alles Wichtige dabei":"Everything you need","Küchenzeile":"Kitchenette","Kochfeld":"Hob","Kochgeschirr":"Cookware","Eigenes Bad":"Private bathroom","Dusche":"Shower","Ess-/Arbeitsplatz":"Dining/work space","Handtücher":"Towels","City-Lage":"City location",
    "ZÜRICH ERLEBEN":"EXPERIENCE ZURICH","Die Wohnung ist kompakt.":"The studio is compact.","Dein Radius ist es nicht.":"Your possibilities are not.","Die Stärke dieses Studios liegt draußen: kurze Wege, gute Anbindung und viele Möglichkeiten für Stadt, See und Ausflüge.":"The strength of this studio lies outside: short distances, excellent connections and plenty of options for the city, lake and day trips.",
    "Eine zentrale Verkehrsdrehscheibe macht viele Ziele in Zürich schnell und unkompliziert erreichbar.":"A central transport hub makes many destinations in Zurich quick and easy to reach.","Historische Gassen, Cafés, Boutiquen und Restaurants für entspannte Stunden in der Stadt.":"Historic lanes, cafés, boutiques and restaurants for relaxed hours in the city.",
    "Innenstadt, Bahnhofstrasse, Restaurants und Cafés gehören zu den klassischen Zürich-Tagen dazu.":"The city centre, Bahnhofstrasse, restaurants and cafés are all part of a classic day in Zurich.","Spaziergänge am Wasser, Badeplätze und Abende mit Blick über den See.":"Waterside walks, swimming spots and evenings overlooking the lake.","Natur & Panorama":"Nature & panorama","Auch Bewegung und Aussicht liegen nah: Spaziergänge, Velotouren und grüne Wege rund um Zürich.":"Nature and views are close too: walks, bike rides and green routes around Zurich.","Rheinfall & Ausflüge":"Rhine Falls & day trips","Für einen Tagesausflug bietet die Region bekannte Ziele wie den Rheinfall und weitere Orte rund um Zürich.":"For a day trip, the region offers famous destinations such as the Rhine Falls and many other places around Zurich.",
    "FLUGHAFEN · BUSINESS · FAMILIE":"AIRPORT · BUSINESS · FAMILY","Eine geräumige Wohnung für Familien, Gruppen und Business-Aufenthalte – ruhig gelegen und gleichzeitig nah an Zürich, Flughafen und Messe.":"A spacious apartment for families, groups and business stays – peacefully located yet close to Zurich, the airport and the exhibition centre.",
    "Zwei Schlafzimmer, ein großzügiger Wohn- und Essbereich, eine voll ausgestattete Küche und ein eigener Balkon machen Dietlikon besonders angenehm, wenn man nicht nur übernachten, sondern wirklich wohnen möchte.":"Two bedrooms, a generous living and dining area, a fully equipped kitchen and a private balcony make Dietlikon especially comfortable when you want more than just a place to sleep.",
    "Bis 6 Gäste":"Up to 6 guests","2 Schlafzimmer · 3 Betten":"2 bedrooms · 3 beds","Bad & separates WC":"Bathroom & separate WC","praktisch für mehrere Gäste":"practical for several guests","10 Min. zum Flughafen":"10 min to the airport","inklusive Tiefgaragenplatz":"underground parking included","Rund 20 Min. nach Zürich":"Around 20 min to Zurich",
    "WOHNEN IN DIETLIKON":"STAYING IN DIETLIKON","Platz für Alltag, Reise und gemeinsame Zeit.":"Space for everyday life, travel and time together.",
    "Die Wohnung ist bewusst auf längere und flexible Aufenthalte ausgelegt. Zwei Schlafzimmer mit großen Betten, ein Schlafsofa im Wohnbereich und Kinderbetten schaffen unterschiedliche Schlafmöglichkeiten.":"The apartment is designed for longer and flexible stays. Two bedrooms with large beds, a sofa bed in the living area and children's beds provide a range of sleeping options.",
    "Die Küche ist komplett ausgestattet, schnelles WLAN und ein Arbeitsplatz passen auch zu Business-Aufenthalten. Dazu kommen ein kostenloser Tiefgaragenplatz, Self Check-in per Smartlock und eine ruhige Wohnlage.":"The kitchen is fully equipped, while fast Wi-Fi and a workspace also suit business stays. A free underground parking space, self check-in via smart lock and a quiet residential location complete the setup.",
    "Voll ausgestattete Küche":"Fully equipped kitchen","Arbeitsplatz":"Workspace","Tiefgaragenplatz":"Underground parking","Balkon":"Balcony","Haustiere erlaubt":"Pets allowed","2 Schlafzimmer":"2 bedrooms","Schlafsofa":"Sofa bed","Kinderbetten":"Children's beds","Ruhige Wohnlage":"Quiet residential area",
    "RUND UM DIETLIKON":"AROUND DIETLIKON","Zwischen Flughafen und Zürich.":"Between the airport and Zurich.","Und trotzdem ruhig.":"And still peaceful.","Dietlikon ist ein praktischer Ausgangspunkt für Stadt, Arbeit und Anreise – mit kurzen Wegen und einer ruhigen Basis für den Abend.":"Dietlikon is a practical base for the city, work and travel – with short distances and a peaceful place to return to in the evening.",
    "Der Flughafen Zürich ist in rund zehn Minuten erreichbar.":"Zurich Airport is around ten minutes away.","Mit dem öffentlichen Verkehr ist das Zürcher Zentrum in etwa 20 Minuten erreichbar.":"Zurich city centre is around 20 minutes away by public transport.","Messe & Business":"Exhibition & business","Die Nähe zum Messegelände macht die Wohnung auch für berufliche Aufenthalte interessant.":"The proximity to the exhibition centre also makes the apartment attractive for business stays.","Alles in der Nähe":"Everything nearby","Einkaufsmöglichkeiten und Restaurants befinden sich in gut erreichbarer Umgebung.":"Shops and restaurants are within easy reach.","Öffentliche Verkehrsmittel sorgen für flexible Wege Richtung Zürich und Umgebung.":"Public transport provides flexible connections to Zurich and the surrounding area.","Ruhig ankommen":"Come home to calm","Die Wohnung liegt in einem Wohnquartier und bietet nach einem vollen Tag einen entspannten Rückzugsort.":"The apartment is located in a residential neighbourhood and offers a relaxed retreat after a busy day.",
    "BERGE · FAMILIE · AUSZEIT":"MOUNTAINS · FAMILY · TIME OUT","Bergnah wohnen.":"Stay close to the mountains.","Gemütlich ankommen.":"Settle in comfortably.","Eine familienfreundliche Wohnung inmitten der Bündner Bergwelt – mit hellem Wohnbereich, eigener Küche, großem Essplatz und Balkon.":"A family-friendly apartment in the heart of the Graubünden mountains – with a bright living area, private kitchen, large dining space and balcony.","Drinnen sorgen Holz, der markante Kaminbereich und viel Platz zum Zusammensitzen für ein wohnliches Gefühl. Draußen warten Bergluft, Garten und die Natur rund um Churwalden und Lenzerheide.":"Inside, wood, the distinctive fireplace area and plenty of space to sit together create a homely feel. Outside, mountain air, a garden and the nature around Churwalden and Lenzerheide await.",
    "2 Schlafzimmer · familienfreundlich":"2 bedrooms · family-friendly","Eigene Küche":"Private kitchen","großer Essbereich · Kaffee & Kochen":"large dining area · coffee & cooking","Bad & Balkon":"Bathroom & balcony","modernes Bad · Bergluft inklusive":"modern bathroom · mountain air included","Drinnen & draußen":"Inside & outside","Wohnbereich · Garten · Grillplatz":"living area · garden · barbecue area",
    "WOHNEN IN CHURWALDEN":"STAYING IN CHURWALDEN","Gemütliche Basis für Tage in den Bergen.":"A cosy base for days in the mountains.","Der Wohnbereich verbindet Sofa, TV und den charakteristischen Kaminbereich zu einem unkomplizierten Treffpunkt nach einem Tag draußen. Die hellen Räume und Holzelemente passen zur ruhigen Berglage.":"The living area brings together the sofa, TV and distinctive fireplace to create an easy meeting place after a day outdoors. Bright rooms and wooden details suit the peaceful mountain setting.","Die Küche ist offen an den Essplatz angebunden. Balkon, Garten und Grillplatz erweitern die Wohnung an sonnigen Tagen nach draußen – passend für Familien und gemeinsame Auszeiten.":"The kitchen opens onto the dining area. On sunny days, the balcony, garden and barbecue area extend the apartment outdoors – ideal for families and time away together.",
    "Garten":"Garden","Grillplatz":"Barbecue area","Modernes Bad":"Modern bathroom","Doppelbett":"Double bed","Etagenbett":"Bunk bed","Familienfreundlich":"Family-friendly","Berglage":"Mountain setting","Stauraum":"Storage",
    "BERGE · NATUR · GRAUBÜNDEN":"MOUNTAINS · NATURE · GRAUBÜNDEN","Vom ersten Schwung":"From the first ski run","bis zum Bergsee.":"to the mountain lake.","Rund um Churwalden wechseln sich aktive Tage und ruhige Momente ab. Einige Ziele liegen direkt in der Region, andere eignen sich als Ausflug durch Graubünden.":"Around Churwalden, active days alternate with quiet moments. Some destinations are right in the region, while others are perfect for a day trip through Graubünden.","Skigebiet, Bergbahnen und Wintertage mitten in der Ferienregion Arosa Lenzerheide.":"Ski slopes, mountain lifts and winter days in the heart of the Arosa Lenzerheide holiday region.","Langlauf & Winterwald":"Cross-country skiing & winter forest","Loipen und verschneite Wege für sportliche oder ruhige Wintertage.":"Cross-country trails and snow-covered paths for active or peaceful winter days.","Bündner Bergdörfer":"Graubünden mountain villages","Kleine Orte, weite Hänge und echtes Graubünden-Gefühl rund um die Unterkunft.":"Small villages, wide slopes and an authentic Graubünden atmosphere around the property.","Bergseen":"Mountain lakes","Wandern, Aussicht und klare Berglandschaften für Ausflüge in der Region.":"Hiking, views and pristine mountain landscapes for trips around the region.","Arosa Bärenland":"Arosa Bear Sanctuary","Ein besonderes Ausflugsziel für Familien und Tierfreunde.":"A special destination for families and animal lovers.","Rhätische Bahn":"Rhaetian Railway","Graubünden lässt sich auch entspannt auf Schienen entdecken.":"Graubünden can also be explored comfortably by rail.",
    "PERSÖNLICH BETREUT · FAMILIÄR GEDACHT":"PERSONALLY CARED FOR · FAMILY MINDED","Hinter Stay with us Homes":"Behind Stay with us Homes","steht eine Familie.":"is a family.","Unsere Unterkünfte sind kein anonymes Portfolio. Hinter ihnen stehen Menschen, die selbst vermieten, verwalten, instand halten und wissen, worauf es bei einem gut betreuten Aufenthalt ankommt.":"Our stays are not an anonymous portfolio. Behind them are people who rent, manage and maintain properties themselves and know what makes a well-cared-for stay.",
    "WER WIR SIND":"WHO WE ARE","Aus eigener Erfahrung entstanden.":"Built from our own experience.","Geiger Immobilien ist kein klassisches Immobilienunternehmen, sondern ein Familienprojekt. Mehrere Generationen bringen ihre Perspektive ein: ein eigenes Architekturbüro in Zürich, langjährige Erfahrung als Immobilieneigentümer und die operative Betreuung von Vermietung und Verwaltung.":"Geiger Immobilien is not a conventional property company, but a family project. Several generations contribute their perspective: an architecture practice in Zurich, many years of experience as property owners and hands-on management of rentals and properties.","Vor rund fünf Jahren kam eine weitere Firma im Immobilienbereich dazu. Seither gehören langfristige Mietverhältnisse, möblierte Kurzzeitvermietungen und die Verwaltung eigener Liegenschaften zum Alltag – und damit auch die kleinen Details, die für Gäste, Eigentümer und Nachbarn den Unterschied machen.":"Around five years ago, another company in the property sector joined the family business. Since then, long-term tenancies, furnished short stays and managing our own properties have become part of everyday life – along with the small details that make a difference to guests, owners and neighbours.",
    "DEINE ANSPRECHPERSON":"YOUR CONTACT","Als Mutter von drei Kindern und nach mehr als zehn Jahren Selbstständigkeit in der Textilbranche kümmert sich Kim heute um die operative Betreuung. Kurz- und Langzeitvermietungen, Ferienwohnungen und eigene Liegenschaften laufen bei ihr zusammen.":"As a mother of three and after more than ten years of self-employment in the textile industry, Kim now handles day-to-day operations. Short- and long-term rentals, holiday homes and our own properties all come together with her.","Ihr Anspruch: erreichbar sein, Verantwortung übernehmen und Anliegen direkt und unkompliziert klären. Wohnungen werden regelmäßig kontrolliert, kleinere Unterhaltsarbeiten selbst erledigt und größere Themen zuverlässig mit Verwaltung oder Handwerkern koordiniert.":"Her approach is simple: be available, take responsibility and resolve matters directly and without fuss. Apartments are checked regularly, minor maintenance is handled personally and larger issues are reliably coordinated with property managers or tradespeople.",
    "EIN NETZWERK, DAS DIREKT GREIFT":"A NETWORK THAT WORKS DIRECTLY","Architektur, Eigentümer-Erfahrung":"Architecture, owner experience","und Handwerk in der Familie.":"and skilled trades in the family.","Auch bei baulichen Fragen und Reparaturen bleiben die Wege kurz: In unserer Familie kommen Erfahrung aus Architektur, Immobilieneigentum und Handwerk zusammen. So können wir viele Themen direkt einschätzen und Anpassungen oder Reparaturen unkompliziert koordinieren.":"When it comes to building matters and repairs, communication stays direct too: our family combines experience in architecture, property ownership and skilled trades. This allows us to assess many issues quickly and coordinate adjustments or repairs without unnecessary detours.","Das Ziel ist einfach: Immobilien sorgfältig pflegen, Eigentümer entlasten und Gästen eine ruhige, gut betreute Nutzung ermöglichen.":"The goal is simple: care for properties properly, support owners and give guests a calm, well-managed stay.",
    "DEIN AUFENTHALT":"YOUR STAY","Welche Unterkunft passt zu deiner Reise?":"Which stay suits your trip?","Kilchberg verbindet Familienkomfort mit See-Nähe, Zürich ist die kompakte City-Base, Dietlikon bietet viel Platz und Churwalden bringt die Bündner Bergwelt direkt vor die Tür.":"Kilchberg combines family comfort with proximity to the lake, Zurich is the compact city base, Dietlikon offers plenty of space and Churwalden puts the Graubünden mountains right on your doorstep.","Kilchberg buchen":"Book Kilchberg","Zürich buchen":"Book Zurich","Dietlikon buchen":"Book Dietlikon","Churwalden buchen":"Book Churwalden",
    "Ferienwohnungen & Apartments in der Schweiz.":"Holiday homes & apartments in Switzerland.","Impressum":"Legal notice","Datenschutz":"Privacy","Nach oben ↑":"Back to top ↑",
    "KONTAKT":"CONTACT","Wie können wir helfen?":"How can we help?","Schreib uns kurz, worum es geht. Für Verfügbarkeit und Preise nutzt du am besten direkt den Kalender der jeweiligen Unterkunft.":"Tell us briefly what you need. For availability and prices, please use the calendar for the relevant property.","E-Mail":"Email","Telefon":"Phone","optional":"optional","Unterkunft":"Property","Bitte auswählen":"Please select","Allgemeine Anfrage":"General enquiry","Nachricht":"Message","Ich stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage verwendet werden.":"I agree that my details may be used to process my enquiry.","Datenschutzerklärung":"Privacy policy","Nachricht senden":"Send message"
  }));

  const enToDe=new Map([...deToEn].map(([de,en])=>[en,de]));
  const textNodes=[];
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
    const node=walker.currentNode;
    if(node.parentElement?.closest('.smoobu-host-frame')) continue;
    if(node.nodeValue.trim()) textNodes.push(node);
  }

  // Preserve the original German text so switching is always lossless.
  textNodes.forEach(node=>{ node.__deText=node.nodeValue; });

  const translatableAttrs=['placeholder','title','aria-label'];
  document.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el=>{
    translatableAttrs.forEach(attr=>{
      if(el.hasAttribute(attr)) el.dataset['de'+attr.replace('-','')]=el.getAttribute(attr);
    });
  });

  function translateTextValue(value,map){
    const lead=value.match(/^\s*/)?.[0]||'';
    const trail=value.match(/\s*$/)?.[0]||'';
    const core=value.trim();
    return lead+(map.get(core)||core)+trail;
  }

  function setLanguage(lang){
    const english=lang==='en';
    const map=english?deToEn:enToDe;

    textNodes.forEach(node=>{
      if(english){
        node.nodeValue=translateTextValue(node.__deText,deToEn);
      }else{
        node.nodeValue=node.__deText;
      }
    });

    document.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el=>{
      translatableAttrs.forEach(attr=>{
        const key='de'+attr.replace('-','');
        const original=el.dataset[key];
        if(!original)return;
        if(!english){el.setAttribute(attr,original);return;}
        const attrMap={
          'Wie können wir dir helfen?':'How can we help you?',
          'Hauptnavigation':'Main navigation',
          'Sprache wählen':'Choose language',
          'Kontaktformular schließen':'Close contact form',
          'Galerie schließen':'Close gallery',
          'Vorheriges Bild':'Previous image',
          'Nächstes Bild':'Next image',
          'Stay With Us Homes Startseite':'Stay With Us Homes home'
        };
        el.setAttribute(attr,attrMap[original]||original);
      });
    });

    document.documentElement.lang=lang;
    document.querySelectorAll('.language-option').forEach(btn=>{
      const active=btn.dataset.lang===lang;
      btn.classList.toggle('is-active',active);
      btn.setAttribute('aria-pressed',String(active));
    });
    localStorage.setItem('staywithus-language',lang);
  }

  document.querySelectorAll('.language-option').forEach(btn=>{
    btn.addEventListener('click',()=>setLanguage(btn.dataset.lang));
  });

  const saved=localStorage.getItem('staywithus-language');
  setLanguage(saved==='en'?'en':'de');

  // Make the dynamic contact-form notice follow the selected homepage language.
  window.getHomepageLanguage=()=>document.documentElement.lang;
})();
