import './style.css'

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
gsap.registerPlugin(ScrollTrigger,ScrollSmoother);

 
window.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.visibility = 'visible';
  document.documentElement.style.opacity = '1';

//     // Interception Observer for animations
//   const animatedElements = document.querySelectorAll('[class*="animate-"]');

//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         entry.target.classList.add('is-visible');
//         observer.unobserve(entry.target); // Optional: only animate once
//       }
//     });
//   }, { threshold: 0.1 });

//   animatedElements.forEach(el => observer.observe(el));



});


Rotation();
ParallaxEffect();
SmoothScroll();
PinningEffect();
ServicesScroll();
ServiceCard();


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
        fontSize: 70,
        centerX: canvasLogo.width / 2,
        centerY: canvasLogo.height / 2,
        rotationAngle: 0,
        angleIncrement: Math.PI / "NAIL STUDIO".length,
        hasImage: true
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
        centerX: canvasTextGallery.width / 2,
        centerY: canvasTextGallery.height / 2,
        rotationAngle: 0,
        angleIncrement: Math.PI / "WHAT WE DO".length,
        hasImage: false
    };

    function drawRotatingText() {
        // Logo
        logo.ctx.clearRect(0, 0, logo.canvas.width, logo.canvas.height);
        if (logo.hasImage && img.complete) {
            const imgSize = 500;
            logo.ctx.drawImage(img, logo.centerX - imgSize / 2, logo.centerY - imgSize / 2, imgSize, imgSize);
        }
        logo.ctx.font = `${logo.fontSize}px Eras Light ITC`;
        logo.ctx.fillStyle = "#333333";
        logo.ctx.textAlign = "center";
        logo.ctx.textBaseline = "alphabetic";
        for (let i = 0; i < logo.text.length; i++) {
            const angle = i * logo.angleIncrement + logo.rotationAngle - Math.PI / 2;
            const x = logo.centerX + logo.radius * Math.cos(angle);
            const y = logo.centerY + logo.radius * Math.sin(angle);
            logo.ctx.save();
            logo.ctx.globalAlpha = 0.7; // Text opacity 
            logo.ctx.translate(x, y);
            logo.ctx.rotate(angle + Math.PI / 2);
            logo.ctx.fillText(logo.text[i], 0, 0);
            logo.ctx.restore();
        }
        logo.rotationAngle += 0.003;

        // Text Gallery
        textGallery.ctx.clearRect(0, 0, textGallery.canvas.width, textGallery.canvas.height);
        textGallery.ctx.font = `${textGallery.fontSize}px Eras Light ITC`;
        textGallery.ctx.fillStyle = "#333333";
        textGallery.ctx.textAlign = "center";
        textGallery.ctx.textBaseline = "alphabetic";
        for (let i = 0; i < textGallery.text.length; i++) {
            const angle = i * textGallery.angleIncrement + textGallery.rotationAngle - Math.PI / 2;
            const x = textGallery.centerX + textGallery.radius * Math.cos(angle);
            const y = textGallery.centerY + textGallery.radius * Math.sin(angle);
            textGallery.ctx.save();
            textGallery.ctx.translate(x, y);
            textGallery.ctx.rotate(angle + Math.PI / 2);
            textGallery.ctx.fillText(textGallery.text[i], 0, 0);
            textGallery.ctx.restore();
        }
        textGallery.rotationAngle += 0.006;

        requestAnimationFrame(drawRotatingText);
    }

    img.onload = function() {
        drawRotatingText();
    };
    // Si la imagen ya está cargada (por caché), iniciar de inmediato
    if (img.complete) {
        drawRotatingText();
    }
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
    // Pinning de la sección completa y las imágenes
    const pinSection = document.querySelector(".pin-imgs-section");
    const pinImgsContainer = document.querySelector(".pin-imgs-container");
    const pinImgs = gsap.utils.toArray(".pin-img");
    
    if (pinSection && pinImgsContainer && pinImgs.length) {
        // Calcular la altura total necesaria para el scroll
        const containerHeight = pinImgsContainer.getBoundingClientRect().height;
        const totalHeight = containerHeight * (pinImgs.length); // -1 porque la primera imagen no se mueve
        
        
        
        // Asegurarnos que el contenedor padre tenga overflow hidden
        pinImgsContainer.style.overflow = "hidden";
        
        // Fijar la sección completa durante el scroll
        ScrollTrigger.create({
            trigger: pinSection,
            start: "top top",
            end: `bottom+=${totalHeight} bottom`, // Ajustamos para que dure hasta que la última imagen esté completamente visible
            pin: true,
            pinSpacing: true,
        });

        // Animar cada imagen para que se apile
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
    // Parallax for img containers
    gsap.utils.toArray(".parallax-container").forEach(container => {
        const yTransition = container.dataset.parallaxY !== undefined ? 
                        parseInt(container.dataset.parallaxY) : 0;
        const xTransition = container.dataset.parallaxX !== undefined ?
                        parseInt(container.dataset.parallaxX) : 0;
        const startPoint = container.dataset.startPoint !== undefined ?
                        container.dataset.startPoint : "top bottom"; 
                    

        gsap.to(container, {
            scrollTrigger: {
                trigger: container,
                toggleActions: "play none reverse none",
                start: startPoint, //me quede aki, darle start a cada elemento html
                end: "bottom top",
                scrub: 0.2,
            },
            y: -yTransition,
            x: xTransition,
            duration: 1,
            ease: "none",
        });
    });

    // Parallax for img
    gsap.utils.toArray(".parallax-img").forEach(img => {
        const yTransition = img.dataset.parallaxY !== undefined ? 
                        parseInt(img.dataset.parallaxY) : 0;
        const xTransition = img.dataset.parallaxX !== undefined ?
                        parseInt(img.dataset.parallaxX) : 0;
        const startPoint = img.dataset.startPoint !== undefined ?
                        img.dataset.startPoint : "top bottom";
                      
        gsap.to(img, {
            scrollTrigger: {
                trigger: img,
                toggleActions: "play none reverse none",
                start: startPoint, 
                end: "bottom top",
                scrub: 0.2,
            },
            y: -yTransition,
            x: xTransition,
            duration: 1,
            ease: "none",
        });
    });
};

function ServicesScroll() {
    const servicesSection = document.querySelector(".services-section");
    const sideDivs = gsap.utils.toArray(".side-div");
    const middleDiv = document.querySelector(".middle-div");
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
    if (!servicesSection) return;
    gsap.utils.toArray('.side-div').forEach((sideDiv) => {
        gsap.to(sideDiv, {
            scrollTrigger: {
                trigger: servicesSection,
                start: "top top",
                endTrigger: sideDivs[0],
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
            endTrigger: sideDivs[0],
            end: `bottom+=${scrollHeight} bottom`,
            scrub: 1.5,
        },
        y: scrollHeight,
    });
};

function ServiceCard() {
    const expandedCardInfo = [
        {
            id: "rubber-base",
            service: "Rubber Base",
            src: "/pictures/rubber-base.webp",
            description: "A flexible, long-lasting base coat that strengthens your natural nails and helps prevent breakage. Perfect for added durability and a smooth, even surface before color application. Ideal for weak or brittle nails!",
        },
        {
            id: "polygel",
            service: "Polygel",
            src: "/pictures/polygel.webp",
            description: "A hybrid nail enhancement that combines the strength of acrylic with the flexibility of gel. Lightweight, odorless, and easy to shape, Polygel is perfect for natural-looking extensions or overlays with long-lasting durability and comfort.",
        },
        {
            id: "gel-x",
            service: "Gel-X",
            src: "/pictures/gel-x.webp",
            description: "A full-cover, soft gel extension system that offers a lightweight, flexible, and natural-looking alternative to traditional enhancements. Quick to apply and gentle on natural nails, Gel-X provides flawless, long-lasting results with minimal filing or damage.",
        },
        {
            id: "simple-nail-art",
            service: "Simple Nail Art",
            src: "/pictures/simple-nail-art.webp",
            description: "Elegant, minimal designs such as lines, dots, French tips, or subtle accents. A refined way to personalize your nails with a clean, stylish touch.",
        },
        {
            id: "intermediate-nail-art",
            service: "Intermediate Nail Art",
            src: "/pictures/intermediate-nail-art.webp",
            description: "Includes more detailed designs like florals, abstract patterns, or themed sets. A creative way to express your style with balanced detail and sophistication.",
        },
        {
            id: "advanced-nail-art",
            service: "Advanced Nail Art",
            src: "/pictures/advanced-nail-art.webp",
            description: "Intricate, hand-painted designs, 3D elements, character art, or layered patterns. Perfect for bold, statement looks and custom, artistic expression.",
        },
        {
            id: "french-manicure",
            service: "French Manicure",
            src: "/pictures/french-manicure.webp",
            description: "A timeless and elegant style featuring a natural pink or nude base with crisp white tips. Perfect for a clean, classic look that suits any occasion.",
        },
        {
            id: "acrylic-nails",
            service: "Acrylic Nails",
            src: "/pictures/acrylic-nails.webp",
            description: "A durable and versatile nail enhancement created by combining liquid monomer and powder polymer. Ideal for adding length, strength, and shape to natural nails, with a flawless finish that lasts for weeks.",
        },
        {
            id: "builder-gel",
            service: "Builder Gel",
            src: "/pictures/builder-gel.webp",
            description: "A lightweight and durable gel ideal for strengthening natural nails or creating extensions. Perfect for clients with weak or brittle nails, it offers a more flexible and natural feel compared to acrylic, while still providing long-lasting structure and a flawless finish.",
        },
        {
            id: "russian-manicure",
            service: "Russian Manicure",
            src: "/pictures/russian-manicure.webp",
            description: "A meticulous dry manicure technique that focuses on detailed cuticle work using an electric file. It results in a clean, polished appearance and longer-lasting nail enhancements, offering a refined and elegant finish.",
        },
        {
            id: "luxury-manicure",
            service: "Luxury Manicure",
            src: "/pictures/luxury-manicure.webp",
            description: "Experience the ultiate in nail care with a meticulous Russian manicure and long-lasting gel polish. This deluxe treatmentalso includes exfoliation, a relaxing hand massage, a collagen mask, and a paraffin wax treatment for flawless, elegant hands",
        }
    ];
        


    const serviceCards = document.querySelectorAll(".service-card");
    serviceCards.forEach(card => {
        card.addEventListener("click", () => {
            const modal = document.getElementById('modal');
            if (!modal.classList.contains('hidden')) return;
            const modalImg = modal.querySelector('img');
            const modalService = modal.querySelector('span');
            const modalDescription = modal.querySelector('p');

            const cardId = card.id;
            const cardInfo = expandedCardInfo.find(info => info.id === cardId);
            modalImg.src = cardInfo.src;
            modalService.textContent = cardInfo.service;
            modalDescription.textContent = cardInfo.description;

            modal.classList.remove('hidden');
            modal.classList.add('expanded-card');

            // Overlay para cerrar
            const overlay = document.createElement('div');
            overlay.className = 'card-overlay';
            overlay.classList.add('animate-expand-vertically');
            overlay.addEventListener('click', () => {
                modal.classList.add('hidden');
                modal.classList.remove('expanded-card');
                overlay.remove();
            });
            document.body.appendChild(overlay);
            document.body.appendChild(modal);
        });
    });
}






