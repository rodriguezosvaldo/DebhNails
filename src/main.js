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


Rotation()
ParallaxEffect()





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
        textGallery.rotationAngle += 0.003;

        requestAnimationFrame(drawRotatingText);
    }

    img.onload = function() {
        drawRotatingText();
    };
    // Si la imagen ya está cargada (por caché), iniciar de inmediato
    if (img.complete) {
        drawRotatingText();
    }
}



function ParallaxEffect() {
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


