import './style.css'
import 'lenis/dist/lenis.css'

import Lenis from 'lenis'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

let lenis;

 
window.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.visibility = 'visible';
  document.documentElement.style.opacity = '1';

    SmoothScroll();
    Rotation();
    ParallaxEffect();
    PinningEffect();
    ServiceCard();
    ServicesScroll();
    Gallery();
    ScrollTrigger.refresh();

    window.addEventListener('load', () => ScrollTrigger.refresh());
});





function Rotation() {
    // Logo variables
    const canvasLogo = document.getElementById("rotatingLogo");
    if (!canvasLogo) return;
    const contextLogo = canvasLogo.getContext("2d");
    const logo = {
        canvas: canvasLogo,
        ctx: contextLogo,
        text: "NAIL STUDIO",
        radius: 235,
        fontSize: 80,
        weight: "200",
        centerX: canvasLogo.width / 2,
        centerY: canvasLogo.height / 2,
        rotationAngle: 0,
        angleIncrement: Math.PI / ("NAIL STUDIO".length*1.3),
        hasImage: true,
        cssSize: 600,
        dpr: Math.max(1, window.devicePixelRatio || 1)
    };
    const img = new Image();
    img.src = "/logos/logo.webp";

    // Gallery variables
    const canvasTextGallery = document.getElementById("rotatingTextGallery");
    if (!canvasTextGallery) return;
    const contextTextGallery = canvasTextGallery.getContext("2d");
    const textGallery = {
        canvas: canvasTextGallery,
        ctx: contextTextGallery,
        text: "WHAT WE DO",
        radius: 120,
        fontSize: 30,
        weight: "200",
        centerX: canvasTextGallery.width / 2,
        centerY: canvasTextGallery.height / 2,
        rotationAngle: 0,
        angleIncrement: Math.PI / ("WHAT WE DO".length*1.3),
        hasImage: false
    };

    function setLogoCanvasSize() {
        // Desired base size is 600px at >=1024px; smaller screens scale down
        const viewportWidth = window.innerWidth || 800;
        const targetCssSize = viewportWidth >= 1024 ? 600 : Math.max(120, Math.min(400, Math.floor(viewportWidth * 0.8)));
        logo.cssSize = targetCssSize;
        logo.dpr = Math.max(1, window.devicePixelRatio || 1);

        // Set backing store to cssSize * dpr for crispness
        logo.canvas.width = Math.floor(targetCssSize * logo.dpr);
        logo.canvas.height = Math.floor(targetCssSize * logo.dpr);
        logo.canvas.style.width = `${targetCssSize}px`;
        logo.canvas.style.height = `${targetCssSize}px`;

        // Normalize drawing to CSS pixels
        logo.ctx.setTransform(logo.dpr, 0, 0, logo.dpr, 0, 0);

        // Recompute metrics relative to 600px base
        const scale = targetCssSize / 600;
        logo.centerX = targetCssSize / 2;
        logo.centerY = targetCssSize / 2;
        logo.radius = 235 * scale;
        logo.fontSize = 80 * scale;
        logo.imgSize = 500 * scale;
    }

    function drawRotatingText() {
        // Logo
        // Clear using CSS pixel coords (transform already applied)
        logo.ctx.clearRect(0, 0, logo.cssSize, logo.cssSize);
        if (logo.hasImage && img.complete) {
            const imgSize = logo.imgSize || 500;
            logo.ctx.drawImage(img, logo.centerX - imgSize / 2, logo.centerY - imgSize / 2, imgSize, imgSize);
        }
        logo.ctx.font = `${logo.weight} ${logo.fontSize}px IBM Plex Sans`;
        logo.ctx.fillStyle = "#454545";
        logo.ctx.textAlign = "center";
        logo.ctx.textBaseline = "alphabetic";
        for (let i = 0; i < logo.text.length; i++) {
            const angle = i * logo.angleIncrement + logo.rotationAngle - Math.PI / 2;
            const x = logo.centerX + logo.radius * Math.cos(angle);
            const y = logo.centerY + logo.radius * Math.sin(angle);
            logo.ctx.save();
            logo.ctx.globalAlpha = 0.4; // Text opacity 
            logo.ctx.translate(x, y);
            logo.ctx.rotate(angle + Math.PI / 2);
            logo.ctx.fillText(logo.text[i], 0, 0);
            logo.ctx.restore();
        }
        logo.rotationAngle += 0.003;

        // Text Gallery
        textGallery.ctx.clearRect(0, 0, textGallery.canvas.width, textGallery.canvas.height);
        textGallery.ctx.font = `${textGallery.weight} ${textGallery.fontSize}px IBM Plex Sans`;
        textGallery.ctx.fillStyle = "#454545";
        textGallery.ctx.textAlign = "center";
        textGallery.ctx.textBaseline = "alphabetic";
        for (let i = 0; i < textGallery.text.length; i++) {
            const angle = i * textGallery.angleIncrement + textGallery.rotationAngle - Math.PI / 2;
            const x = textGallery.centerX + textGallery.radius * Math.cos(angle);
            const y = textGallery.centerY + textGallery.radius * Math.sin(angle);
            textGallery.ctx.save();
            textGallery.ctx.globalAlpha = 0.4; // Text opacity 
            textGallery.ctx.translate(x, y);
            textGallery.ctx.rotate(angle + Math.PI / 2);
            textGallery.ctx.fillText(textGallery.text[i], 0, 0);
            textGallery.ctx.restore();
        }
        textGallery.rotationAngle += 0.006;

        requestAnimationFrame(drawRotatingText);
    }

    function initLogoCanvas() {
        setLogoCanvasSize();
        drawRotatingText();
    }

    img.onload = function() { initLogoCanvas(); };
    if (img.complete) { initLogoCanvas(); }

    // Resize handler to keep canvas responsive
    window.addEventListener('resize', () => {
        const prevSize = logo.cssSize;
        setLogoCanvasSize();
        // Avoid jump in rotation on resize; keep angle
    });
};

function SmoothScroll() {
    lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
};

function PinningEffect() {
    const pinSection = document.querySelector(".pin-imgs-section");
    const pinImgsContainer = document.querySelector(".pin-imgs-container");
    const pinImgs = gsap.utils.toArray(".pin-img");
    const pinTitle = document.getElementById("pin-title");
    const pinTitles = ["Design", "Style", "Personality"];
    let pinTriggers = [];

    const setPinTitle = (index) => {
        if (!pinTitle || !pinTitles[index] || pinTitle.textContent === pinTitles[index]) return;
        pinTitle.textContent = pinTitles[index];
        pinTitle.classList.remove("animate-blurred-fade-in", "animate-duration-1000");
        void pinTitle.offsetWidth;
        pinTitle.classList.add("animate-blurred-fade-in", "animate-duration-1000");
    };

    const killPinning = () => {
        pinTriggers.forEach((st) => st.kill());
        pinTriggers = [];
        if (pinImgsContainer) {
            pinImgsContainer.style.overflow = "";
        }
        gsap.set(pinImgs, { clearProps: "y,position,top,left,width,height,transform,zIndex" });
    };

    const initPinning = () => {
        if (!pinSection || !pinImgsContainer || !pinImgs.length) return;

        const containerHeight = pinImgsContainer.getBoundingClientRect().height;
        if (!containerHeight) return;

        // One segment per image transition, PLUS one extra "hold" segment at
        // the end so the last image stays fully visible (and its title has
        // room to display) before the section unpins. Without the extra
        // segment, the last title's window collapses to zero and the pin
        // releases the instant the last image finishes sliding in.
        const scrollDistance = containerHeight * pinImgs.length;

        pinImgsContainer.style.overflow = "hidden";

        gsap.set(pinImgs, {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
        });

        gsap.set(pinImgs[0], { y: 0, zIndex: 1 });

        const pinST = ScrollTrigger.create({
            trigger: pinSection,
            start: "top top",
            end: `+=${scrollDistance}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
        });
        pinTriggers.push(pinST);

        // Nested triggers below are pinned to the SAME element as pinST, so
        // relative start strings like "top+=X top" get re-resolved against
        // the pinned/spaced layout and drift after the first one (GSAP quirk
        // with multiple triggers sharing a pinned trigger element). Anchoring
        // everything to pinST's own resolved numeric start avoids that.
        const pinStart = pinST.start;

        pinImgs.forEach((_, index) => {
            pinTriggers.push(
                ScrollTrigger.create({
                    trigger: pinSection,
                    start: pinStart + containerHeight * index,
                    end: pinStart + containerHeight * (index + 1),
                    onEnter: () => setPinTitle(index),
                    onEnterBack: () => setPinTitle(index),
                })
            );
        });

        pinImgs.forEach((img, index) => {
            if (index === 0) return;

            gsap.set(img, { y: containerHeight * index, zIndex: index + 1 });

            const tween = gsap.to(img, {
                y: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: pinSection,
                    start: pinStart + containerHeight * (index - 1),
                    end: pinStart + containerHeight * index,
                    scrub: 1,
                },
            });

            if (tween.scrollTrigger) {
                pinTriggers.push(tween.scrollTrigger);
            }
        });
    };

    killPinning();
    initPinning();

    const refreshPinning = () => {
        killPinning();
        initPinning();
        ScrollTrigger.refresh();
    };

    window.addEventListener("resize", refreshPinning);
    window.addEventListener("load", refreshPinning);
};

function ParallaxEffect() {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    function killParallax() {
        ScrollTrigger.getAll().forEach((st) => {
            const triggerEl = st.trigger;
            if (triggerEl && (triggerEl.classList.contains('parallax-container') || triggerEl.classList.contains('parallax-img'))) {
                st.kill();
            }
        });
        gsap.set('.parallax-container, .parallax-img', { clearProps: 'x,y,transform' });
    }

    function initParallax() {
        if (!mediaQuery.matches) return;

        // Parallax for img containers
        gsap.utils.toArray('.parallax-container').forEach(container => {
            const yTransition = container.dataset.parallaxY !== undefined ? parseInt(container.dataset.parallaxY) : 0;
            const xTransition = container.dataset.parallaxX !== undefined ? parseInt(container.dataset.parallaxX) : 0;
            const startPoint = container.dataset.startPoint !== undefined ? container.dataset.startPoint : 'top bottom';

            gsap.to(container, {
                scrollTrigger: {
                    trigger: container,
                    toggleActions: 'play none reverse none',
                    start: startPoint,
                    end: 'bottom top',
                    scrub: 1,
                },
                y: -yTransition,
                x: xTransition,
                duration: 1,
                ease: 'none',
            });
        });

        // Parallax for img
        gsap.utils.toArray('.parallax-img').forEach(img => {
            const yTransition = img.dataset.parallaxY !== undefined ? parseInt(img.dataset.parallaxY) : 0;
            const xTransition = img.dataset.parallaxX !== undefined ? parseInt(img.dataset.parallaxX) : 0;
            const startPoint = img.dataset.startPoint !== undefined ? img.dataset.startPoint : 'top bottom';

            gsap.to(img, {
                scrollTrigger: {
                    trigger: img,
                    toggleActions: 'play none reverse none',
                    start: startPoint,
                    end: 'bottom top',
                    scrub: 1,
                },
                y: -yTransition,
                x: xTransition,
                duration: 1,
                ease: 'none',
            });
        });
    }

    // Initialize based on current viewport
    if (mediaQuery.matches) {
        initParallax();
    } else {
        killParallax();
    }

    // Toggle on breakpoint changes
    mediaQuery.addEventListener('change', (e) => {
        if (e.matches) {
            initParallax();
        } else {
            killParallax();
        }
    });
};

function ServiceCard() {
    const serviceCards = [
        {
            id: "rubber-base",
            service: "Rubber Base",
            src: "/pictures/serv-rubber-base.webp",
            w: 700, h: 933,
            price: "$50",
            duration: "1h",
            description: "A flexible, long-lasting base coat that strengthens your natural nails and helps prevent breakage. Perfect for added durability and a smooth, even surface before color application. Ideal for weak or brittle nails!",
        },
        {
            id: "rubber-base+russian-manicure",
            service: "Rubber Base + Russian Manicure",
            src: "/pictures/serv-rubber-base+russian-manicure.jpg",
            w: 480, h: 640,
            price: "$65",
            duration: "1h 30min",
            description: "The best of both worlds: a precise Russian dry manicure for impeccably clean cuticles, paired with a strengthening rubber base for a smooth, durable and long-lasting finish.",
        },
        {
            id: "polygel-full-set",
            service: "Polygel Full Set",
            src: "/pictures/serv-polygel-full-set.jpg",
            w: 480, h: 568,
            price: "$65+",
            duration: "1h 15min",
            description: "A hybrid nail enhancement that combines the strength of acrylic with the flexibility of gel. Lightweight, odorless, and easy to shape, Polygel is perfect for natural-looking extensions or overlays with long-lasting durability and comfort.",
        },
        {
            id: "polygel-fill-in",
            service: "Polygel Fill In",
            src: "/pictures/serv-polygel-fill-in.webp",
            w: 700, h: 933,
            price: "$55+",
            duration: "1h",
            description: "Refresh your Polygel enhancement by filling in the regrowth area. Keeps your nails strong, balanced and looking freshly done while maintaining their shape and durability.",
        },
        {
            id: "gel-x",
            service: "Gel-X",
            src: "/pictures/serv-gel-x.jpg",
            w: 480, h: 596,
            price: "$70+",
            duration: "1h 30min",
            description: "A full-cover, soft gel extension system that offers a lightweight, flexible, and natural-looking alternative to traditional enhancements. Quick to apply and gentle on natural nails, Gel-X provides flawless, long-lasting results with minimal filing or damage.",
        },
        {
            id: "nail-art",
            service: "Nail Art",
            src: "/pictures/serv-nail-art.webp",
            w: 700, h: 933,
            price: "Varies",
            duration: "30min+",
            description: "From minimalist accents to bold, fully custom designs: hand-painted art, chrome, 3D details and more, tailored to express your unique personality. Pricing varies with design complexity.",
        },
        {
            id: "volcano-pedicure",
            service: "Volcano Pedicure",
            src: "/pictures/serv-volcano-pedicure.webp",
            w: 700, h: 1092,
            price: "$70",
            duration: "1h",
            description: "A spa-style pedicure with a fizzing volcano experience that softens, exfoliates and refreshes tired feet. Includes soak, scrub, massage and a flawless gel polish finish.",
        },
        {
            id: "french-manicure",
            service: "French Manicure",
            src: "/pictures/serv-french-manicure.webp",
            w: 700, h: 881,
            price: "Add-on",
            duration: "",
            description: "A timeless and elegant style featuring a natural pink or nude base with crisp white tips. Perfect for a clean, classic look that suits any occasion.",
        },
        {
            id: "russian-manicure",
            service: "Russian Manicure",
            src: "/pictures/serv-russian-manicure.jpg",
            w: 480, h: 640,
            price: "$40",
            duration: "30min",
            description: "A meticulous dry manicure technique that focuses on detailed cuticle work using an electric file. It results in a clean, polished appearance and longer-lasting nail enhancements, offering a refined and elegant finish.",
        },
        {
            id: "acrylic-full-set",
            service: "Acrylic Full Set",
            src: "/pictures/serv-acrylic-full-set.webp",
            w: 480, h: 535,
            price: "$65+",
            duration: "1h 15min",
            description: "A durable and versatile nail enhancement created by combining liquid monomer and powder polymer. Ideal for adding length, strength, and shape to natural nails, with a flawless finish that lasts for weeks.",
        },
        {
            id: "acrylic-fill-in",
            service: "Acrylic Fill In",
            src: "/pictures/serv-acrylic-fill-in.webp",
            w: 480, h: 568,
            price: "$55+",
            duration: "1h",
            description: "Maintain your acrylic set by filling in the natural regrowth. Restores strength, shape and a flawless surface so your nails stay durable and beautiful for weeks.",
        },
        {
            id: "builder-gel-full-set",
            service: "Builder Gel Full Set",
            src: "/pictures/serv-builder-gel-full-set.jpg",
            w: 480, h: 535,
            price: "$65+",
            duration: "1h 15min",
            description: "A lightweight and durable gel ideal for strengthening natural nails or creating extensions. Perfect for clients with weak or brittle nails, it offers a more flexible and natural feel compared to acrylic, while still providing long-lasting structure and a flawless finish.",
        },
        {
            id: "builder-gel-fill-in",
            service: "Builder Gel Fill In",
            src: "/pictures/serv-builder-gel-fill-in.jpg",
            w: 480, h: 535,
            price: "$55+",
            duration: "1h",
            description: "Keep your builder gel nails looking fresh by filling in the regrowth area. Reinforces structure and maintains a smooth, natural and long-lasting finish.",
        },
        {
            id: "builder-gel+russian-manicure",
            service: "Builder Gel + Russian Manicure",
            src: "/pictures/serv-builder-gel+russian-manicure.jpg",
            w: 480, h: 640,
            price: "$80+",
            duration: "1h 45min",
            description: "A full builder gel set combined with a detailed Russian manicure for ultra-clean cuticles, a strong yet flexible structure and an elegant, long-lasting result.",
        },
        {
            id: "luxury-manicure",
            service: "Luxury Manicure",
            src: "/pictures/serv-luxury-manicure.webp",
            w: 700, h: 948,
            price: "$70",
            duration: "1h 15min",
            description: "Experience the ultimate in nail care with a meticulous Russian manicure and long-lasting gel polish. This deluxe treatment also includes exfoliation, a relaxing hand massage, a collagen mask and a paraffin wax treatment for flawless, elegant hands.",
        },
        {
            id: "basic-pedicure",
            service: "Basic Pedicure",
            src: "/pictures/serv-basic-pedicure.webp",
            w: 700, h: 1092,
            price: "$60",
            duration: "1h",
            description: "A complete pedicure with soak, nail shaping, cuticle care, exfoliation and a relaxing massage, finished with long-lasting gel polish for healthy, polished feet.",
        },
        {
            id: "detox-pedicure",
            service: "Detox Pedicure",
            src: "/pictures/serv-detox-pedicure.jpg",
            w: 700, h: 1092,
            price: "$65",
            duration: "1h",
            description: "A purifying pedicure that detoxifies and revitalizes tired feet with cleansing minerals, exfoliation and a soothing massage, finished with a flawless polish.",
        },
        {
            id: "jelly-pedicure",
            service: "Jelly Pedicure",
            src: "/pictures/serv-jelly-pedicure.jpg",
            w: 700, h: 1092,
            price: "$70",
            duration: "1h",
            description: "Sink your feet into a soothing jelly soak that hydrates and softens the skin. Includes exfoliation, massage and a beautiful finish for ultra-soft, refreshed feet.",
        }
    ];

    const createCard = (column, index) => {
        const card = document.createElement('div');
        card.className = 'bg-secondary flex flex-col justify-center items-center w-full p-0.5 rounded-2xl object-cover transition-transform duration-300 hover:scale-105 cursor-pointer';
        card.id = `${serviceCards[index].id}`;
        column.appendChild(card);
        const imgContainer = document.createElement('div');
        imgContainer.className = 'w-full lg:h-52 h-32 object-cover';
        card.appendChild(imgContainer);
        const img = document.createElement('img');
        img.className = 'w-full h-full rounded-2xl object-cover';
        img.src = serviceCards[index].src;
        img.alt = `${serviceCards[index].service} at Debh Nails, Louisville KY`;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.width = serviceCards[index].w;
        img.height = serviceCards[index].h;
        imgContainer.appendChild(img);
        const heading = document.createElement('h3');
        heading.className = 'text-center text-paragraph-small mt-2 mb-2';
        heading.textContent = serviceCards[index].service;
        card.appendChild(heading);
        card.addEventListener("click", () => {
            createModal(serviceCards[index]);
        });
    };

    const leftColumn = document.querySelector('.column-1');
    if (!leftColumn) return;
    for (let i = 0; i < 6; i++) {
        createCard(leftColumn, i);
    }

    const middleColumn = document.querySelector('.column-2');
    if (!middleColumn) return;
    for (let i = 6; i < 12; i++) {
        createCard(middleColumn, i);
    }

    const rightColumn = document.querySelector('.column-3');
    if (!rightColumn) return;
    for (let i = 12; i < 18; i++) {
        createCard(rightColumn, i);
    }

    const createModal = (serviceCard) => {
        // Overlay to close the modal
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/30 z-20 backdrop-blur-6px -webkit-backdrop-blur-6px animate-expand-vertically';
        overlay.setAttribute('data-lenis-prevent', '');
        
        const modal = document.createElement('div');
        modal.className = 'expanded-card';        
        const modalDiv = document.createElement('div');
        modalDiv.className = 'flex flex-col lg:w-full w-2/3 p-0.5 rounded-2xl bg-gradient-to-tr from-primary to-secondary';
        modal.appendChild(modalDiv);
        const imgContainer = document.createElement('div');
        imgContainer.className = 'w-full h-96';
        modalDiv.appendChild(imgContainer);
        const img = document.createElement('img');
        img.className = 'w-full h-full rounded-2xl object-cover';
        img.src = serviceCard.src;
        img.alt = `${serviceCard.service} at Debh Nails, Louisville KY`;
        img.width = serviceCard.w;
        img.height = serviceCard.h;
        imgContainer.appendChild(img);
        const textContainer = document.createElement('div');
        textContainer.className = 'flex flex-col justify-center items-center w-full h-1/2 gap-2 px-2';
        const title = document.createElement('h3');
        title.className = 'text-center text-h3 mt-2';
        title.textContent = serviceCard.service;
        textContainer.appendChild(title);
        if (serviceCard.price) {
            const meta = document.createElement('span');
            meta.className = 'text-center text-paragraph-small opacity-70';
            meta.textContent = serviceCard.duration
                ? `${serviceCard.price} · ${serviceCard.duration}`
                : serviceCard.price;
            textContainer.appendChild(meta);
        }
        const description = document.createElement('p');
        description.className = 'text-paragraph text-center my-2';
        description.textContent = serviceCard.description;
        textContainer.appendChild(description);
        modalDiv.appendChild(textContainer);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        lenis?.stop();

        overlay.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
            lenis?.start();
        });
    };
};

function ServicesScroll() {
    const servicesSection = document.querySelector(".services-section");
    if (!servicesSection) return;
    const sideDivs = gsap.utils.toArray(".column-1, .column-3");
    const middleDiv = document.querySelector(".column-2");
    const sideDivsHeight = sideDivs[0].getBoundingClientRect().height;
    const scrollHeight = sideDivsHeight - window.innerHeight;

    // Pinning services section
    ScrollTrigger.create({
        trigger: servicesSection,
        start: "top top",
        endTrigger: sideDivs[0],
        end: `bottom+=${scrollHeight} bottom`, 
        pin: true,
        pinSpacing: true,
    });

    // Animate side divs on scroll
    gsap.utils.toArray('.column-1, .column-3').forEach((sideDiv) => {
        gsap.to(sideDiv, {
            scrollTrigger: {
                trigger: servicesSection,
                start: "top top",
                endTrigger: sideDiv,
                end: `bottom+=${scrollHeight} bottom`,
                scrub: 1.5,
            },
            y: -scrollHeight,
        });
    });

    gsap.to(middleDiv, {
        scrollTrigger: {
            trigger: servicesSection,
            start: "top top",
            endTrigger: middleDiv,
            end: `bottom+=${scrollHeight} bottom`,
            scrub: 1.5,
        },
        y: scrollHeight,
    });
};

function Gallery() {
    const galleryImages = [
        { id: "1", src: "/pictures/gallery-1.webp", w: 700, h: 933 },
        { id: "2", src: "/pictures/gallery-2.webp", w: 700, h: 933 },
        { id: "3", src: "/pictures/gallery-3.webp", w: 700, h: 933 },
        { id: "4", src: "/pictures/gallery-4.webp", w: 700, h: 834 },
        { id: "5", src: "/pictures/gallery-5.webp", w: 700, h: 933 },
        { id: "6", src: "/pictures/gallery-6.webp", w: 700, h: 1244 },
        { id: "7", src: "/pictures/gallery-7.webp", w: 700, h: 933 },
        { id: "8", src: "/pictures/gallery-8.webp", w: 700, h: 933 },
        { id: "9", src: "/pictures/gallery-9.webp", w: 700, h: 834 },
        { id: "10", src: '/pictures/gallery-10.webp', w: 700, h: 933 },
    ];
    const galleryLoopContainer = document.querySelector(".gallery-loop-1");
    const galleryLoopContainer2 = document.querySelector(".gallery-loop-2");
    
    // Check if gallery containers exist before trying to append images
    // In the services.html file, we get an error because the gallery containers don't exist
    if (!galleryLoopContainer || !galleryLoopContainer2) {
        return; 
    }
    
    const syncGalleryLoopOffset = () => {
        galleryLoopContainer2.style.left = `${galleryLoopContainer.scrollWidth}px`;
    };

    galleryImages.forEach((image, i) => {
        const alt = `Nail design by Debh Nails in Louisville, KY — gallery photo ${i + 1}`;
        const img = document.createElement('img');
        img.className = 'gallery-loop-img w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-cover shrink-0';
        img.src = image.src;
        img.alt = alt;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.width = image.w;
        img.height = image.h;
        galleryLoopContainer.appendChild(img);

        const img2 = document.createElement('img');
        img2.className = 'gallery-loop-img w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-cover shrink-0';
        img2.src = image.src;
        img2.alt = '';
        img2.setAttribute('aria-hidden', 'true');
        img2.loading = 'lazy';
        img2.decoding = 'async';
        img2.width = image.w;
        img2.height = image.h;
        galleryLoopContainer2.appendChild(img2);
    });

    syncGalleryLoopOffset();
    window.addEventListener('resize', syncGalleryLoopOffset);
};