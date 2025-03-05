

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("rotateCanvas");
    const ctx = canvas.getContext("2d");
    const text = "NAILS STUDIO";
    const radius = 250;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const fontSize = 70;
    const angleIncrement = (Math.PI) / text.length;
    let rotationAngle = 0;

    
    const img = new Image();
    img.src = "/assets/logo.PNG"; 

    
    img.onload = function() {
        function drawRotatingText() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            
            const imgSize = 600;  
            ctx.drawImage(img, centerX - imgSize / 2, centerY - imgSize / 2, imgSize, imgSize);
            
            ctx.font = `${fontSize}px Eras Light ITC`;
            ctx.fillStyle = "#d1d5dc";
            ctx.textAlign = "center";
            ctx.textBaseline = "alphabetic";
            
            for (let i = 0; i < text.length; i++) {
                const angle = i * angleIncrement + rotationAngle - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle + Math.PI / 2);
                ctx.fillText(text[i], 0, 0);
                ctx.restore();
            }
            
            rotationAngle += 0.006;
            requestAnimationFrame(drawRotatingText);
        }
        
        drawRotatingText();
    };
}
)

