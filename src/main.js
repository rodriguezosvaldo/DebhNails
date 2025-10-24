import './style.css'

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
gsap.registerPlugin(ScrollTrigger,ScrollSmoother);

 
window.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.visibility = 'visible';
  document.documentElement.style.opacity = '1';

    // Initialize all functions after DOM is loaded
    Rotation();
    ParallaxEffect();
    SmoothScroll();
    PinningEffect();
    ServiceCard();
    ServicesScroll();
    Gallery();
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
    document.querySelectorAll('.smooth-wrapper').forEach(wrapper => {
    const content = wrapper.querySelector('.smooth-content');
    ScrollSmoother.create({
      wrapper: wrapper,
      content: content,
      smooth: 1.5,
      effects: true,
      normalizeScroll: true,
      smoothTouch: 0.1
    });
  });
};

function PinningEffect() {
    // Pinning section and images
    const pinSection = document.querySelector(".pin-imgs-section");
    const pinImgsContainer = document.querySelector(".pin-imgs-container");
    const pinImgs = gsap.utils.toArray(".pin-img");

    // h3 title animation
    const pinTitle = document.getElementById("pin-title");
    const pinTitles = ["Design", "Style", "Personality"];
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const imgIndex = pinImgs.indexOf(entry.target);
                if (pinTitle && pinTitles[imgIndex]) {
                    pinTitle.textContent = pinTitles[imgIndex];
                    pinTitle.classList.remove("animate-blurred-fade-in", "animate-duration-1000");
                    void pinTitle.offsetWidth;
                    pinTitle.classList.add("animate-blurred-fade-in", "animate-duration-1000");
                }
            }
            if (!entry.isIntersecting) {
                const imgIndex = pinImgs.indexOf(entry.target);
                if (pinTitle && pinTitles[imgIndex]) {
                    if (imgIndex === 0) return;
                    pinTitle.textContent = pinTitles[imgIndex - 1];
                    pinTitle.classList.remove("animate-blurred-fade-in", "animate-duration-1000");
                    void pinTitle.offsetWidth;
                    pinTitle.classList.add("animate-blurred-fade-in", "animate-duration-1000");
                }
            }
        });
    }, { threshold: 0.1 });

    pinImgs.forEach(img => observer.observe(img));
    


    if (pinSection && pinImgsContainer && pinImgs.length) {
        // Calculate the total height needed for the scroll
        const containerHeight = pinImgsContainer.getBoundingClientRect().height;
        const totalHeight = containerHeight * (pinImgs.length); 

        // Make sure the parent container has overflow hidden
        pinImgsContainer.style.overflow = "hidden";
        
        // Fix the section during the scroll
        ScrollTrigger.create({
            trigger: pinSection,
            start: "top top",
            end: `bottom+=${totalHeight} bottom`, // Adjust to make it last until the last image is completely visible
            pin: true,
            pinSpacing: true,
        });

        // Animate each image to stack
        pinImgs.forEach((img, index) => {
            if (index === 0) return;
            gsap.fromTo(img, 
                {
                    y: containerHeight * index,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%"
                },
                {
                    y: 0,
                    scrollTrigger: {
                        trigger: pinImgsContainer,
                        start: `top+=${containerHeight * index} bottom-=400px`,
                        end: `top+=${containerHeight * (index + 1)} bottom-=400px`,
                        scrub: 1,
                    }
                }
            );
        });
    };
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
                    scrub: 0.2,
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
                    scrub: 0.2,
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
            description: "A flexible, long-lasting base coat that strengthens your natural nails and helps prevent breakage. Perfect for added durability and a smooth, even surface before color application. Ideal for weak or brittle nails!",
        },
        {
            id: "rubber-base+russian-manicure",
            service: "Rubber Base + Russian Manicure",
            src: "/pictures/serv-rubber-base+russian-manicure.jpg",
            description: "",
        },
        {
            id: "polygel-full-set",
            service: "Polygel Full Set",
            src: "/pictures/serv-polygel-full-set.jpg",
            description: "A hybrid nail enhancement that combines the strength of acrylic with the flexibility of gel. Lightweight, odorless, and easy to shape, Polygel is perfect for natural-looking extensions or overlays with long-lasting durability and comfort.",
        },
        {
            id: "polygel-fill-in",
            service: "Polygel Fill In",
            src: "/pictures/serv-polygel-fill-in.webp",
            description: "falta foto",
        },
        {
            id: "gel-x",
            service: "Gel-X",
            src: "/pictures/serv-gel-x.jpg",
            description: "A full-cover, soft gel extension system that offers a lightweight, flexible, and natural-looking alternative to traditional enhancements. Quick to apply and gentle on natural nails, Gel-X provides flawless, long-lasting results with minimal filing or damage.",
        },
        {
            id: "nail-art",
            service: "Nail Art",
            src: "/pictures/serv-nail-art.webp",
            description: "",
        },
        {
            id: "volcano-pedicure",
            service: "Volcano Pedicure",
            src: "/pictures/serv-volcano-pedicure.webp",
            description: "",
        },
        {
            id: "french-manicure",
            service: "French Manicure",
            src: "/pictures/serv-french-manicure.webp",
            description: "A timeless and elegant style featuring a natural pink or nude base with crisp white tips. Perfect for a clean, classic look that suits any occasion.",
        },
        {
            id: "russian-manicure",
            service: "Russian Manicure",
            src: "/pictures/serv-russian-manicure.jpg",
            description: "A meticulous dry manicure technique that focuses on detailed cuticle work using an electric file. It results in a clean, polished appearance and longer-lasting nail enhancements, offering a refined and elegant finish.",
        },
        {
            id: "acrylic-full-set",
            service: "Acrylic Full Set",
            src: "/pictures/serv-acrylic-full-set.webp",
            description: "A durable and versatile nail enhancement created by combining liquid monomer and powder polymer. Ideal for adding length, strength, and shape to natural nails, with a flawless finish that lasts for weeks.",
        },
        {
            id: "acrylic-fill-in",
            service: "Acrylic Fill In",
            src: "/pictures/serv-acrylic-fill-in.webp",
            description: "",
        },
        {
            id: "builder-gel-full-set",
            service: "Builder Gel Full Set",
            src: "/pictures/serv-builder-gel-full-set.jpg",
            description: "A lightweight and durable gel ideal for strengthening natural nails or creating extensions. Perfect for clients with weak or brittle nails, it offers a more flexible and natural feel compared to acrylic, while still providing long-lasting structure and a flawless finish.",
        },
        {
            id: "builder-gel-fill-in",
            service: "Builder Gel Fill In",
            src: "/pictures/serv-builder-gel-fill-in.jpg",
            description: "",
        },
        {
            id: "builder-gel+russian-manicure",
            service: "Builder Gel + Russian Manicure",
            src: "/pictures/serv-builder-gel+russian-manicure.jpg",
            description: "",
        },
        {
            id: "luxury-manicure",
            service: "Luxury Manicure",
            src: "/pictures/serv-luxury-manicure.webp",
            description: "Experience the ultiate in nail care with a meticulous Russian manicure and long-lasting gel polish. This deluxe treatmentalso includes exfoliation, a relaxing hand massage, a collagen mask, and a paraffin wax treatment for flawless, elegant hands",
        },
        {
            id: "basic-pedicure",
            service: "Basic Pedicure",
            src: "/pictures/serv-basic-pedicure.webp",
            description: "",
        },
        {
            id: "detox-pedicure",
            service: "Detox Pedicure",
            src: "/pictures/serv-detox-pedicure.jpg",
            description: "",
        },
        {
            id: "jelly-pedicure",
            service: "Jelly Pedicure",
            src: "/pictures/serv-jelly-pedicure.jpg",
            description: "",
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
        img.alt = "Service image";
        imgContainer.appendChild(img);
        const span = document.createElement('span');
        span.className = 'text-center text-paragraph-small my-2';
        span.textContent = serviceCards[index].service;
        card.appendChild(span);
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
        img.alt = "Service image";
        imgContainer.appendChild(img);
        const textContainer = document.createElement('div');
        textContainer.className = 'flex flex-col justify-center items-center w-full h-1/2 gap-2 px-2';
        const title = document.createElement('span');
        title.className = 'text-center text-h3 my-2';
        title.textContent = serviceCard.service;
        textContainer.appendChild(title);
        const description = document.createElement('p');
        description.className = 'text-paragraph text-center my-2';
        description.textContent = serviceCard.description;
        textContainer.appendChild(description);
        modalDiv.appendChild(textContainer);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
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
        {
            id: "1",
            src: "/pictures/gallery-1.webp",
            alt: "Gallery Image 1",
        },
        {
            id: "2",
            src: "/pictures/gallery-2.webp",
            alt: "Gallery Image 2",
        },
        {
            id: "3",
            src: "/pictures/gallery-3.webp",
            alt: "Gallery Image 3",
        },
        {
            id: "4",
            src: "/pictures/gallery-4.webp",
            alt: "Gallery Image 4",
        },
        {
            id: "5",
            src: "/pictures/gallery-5.webp",
            alt: "Gallery Image 5",
        },
        {
            id: "6",
            src: "/pictures/gallery-6.webp",
            alt: "Gallery Image 6",
        },
        {
            id: "7",
            src: "/pictures/gallery-7.webp",
            alt: "Gallery Image 7",
        },
        {
            id: "8",
            src: "/pictures/gallery-8.webp",
            alt: "Gallery Image 8",
        },
        {
            id: "9",
            src: "/pictures/gallery-9.webp",
            alt: "Gallery Image 9",
        },
        {
            id: "10",
            src: '/pictures/gallery-10.webp',
            alt: "Gallery Image 10",
        },
    ];
    const galleryLoopContainer = document.querySelector(".gallery-loop-1");
    const galleryLoopContainer2 = document.querySelector(".gallery-loop-2");
    
    // Check if gallery containers exist before trying to append images
    // In the services.html file, we get an error because the gallery containers don't exist
    if (!galleryLoopContainer || !galleryLoopContainer2) {
        return; 
    }
    
    galleryImages.forEach(image => {
        const img = document.createElement('img');
        img.className = 'w-80 h-80 object-cover shrink-0';
        img.src = image.src;    
        img.alt = image.alt;
        galleryLoopContainer.appendChild(img);
        
        const img2 = document.createElement('img');
        img2.className = 'w-80 h-80 object-cover shrink-0';
        img2.src = image.src;    
        img2.alt = image.alt;
        galleryLoopContainer2.appendChild(img2);
    });
};