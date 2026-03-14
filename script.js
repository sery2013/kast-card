// --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ДЛЯ ЭФФЕКТОВ ---
let particles = [];
let animationId = null;
let scanLineY = 0;
let isGenerating = false;
let currentAvatarImg = null;
let reflectionPos = -500;
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function playSound(id, stop = false) {
    const s = document.getElementById(id);
    if (!s) return;
    if (stop) {
        s.pause();
        s.currentTime = 0;
    } else {
        s.play().catch(() => {});
    }
}

function initDigitalFlow() {
    particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * 800,
            y: Math.random() * 400,
            speed: Math.random() * 1.5 + 0.5,
            length: Math.random() * 80 + 30,
            opacity: Math.random() * 0.3
        });
    }
}

function initTilt() {
    const canvas = document.getElementById("cardCanvas");
    if (!canvas) return;
    canvas.addEventListener("mousemove", (e) => {
        if (canvas.style.display === "none") return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (-(y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * 10;
        canvas.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    canvas.addEventListener("mouseleave", () => {
        canvas.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    });
}

function generateCard() {
    playSound("soundClick");
    playSound("soundScan");
    const canvas = document.getElementById("cardCanvas");
    const skeleton = document.getElementById("skeleton");

    if (canvas) canvas.style.display = "block";
    if (skeleton) skeleton.style.display = "none";

    isGenerating = true;
    canvas.classList.add("canvas-generating");
    scanLineY = 0;

    setTimeout(() => {
        isGenerating = false;
        canvas.classList.remove("canvas-generating");
        playSound("soundScan", true);
    }, 2500);

    const ctx = canvas.getContext("2d");
    if (particles.length === 0) initDigitalFlow();
    if (animationId) cancelAnimationFrame(animationId);

    const avatarInput = document.getElementById("avatar");

    if (avatarInput.files && avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                currentAvatarImg = img;
                startLoop();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        startLoop();
    }

    function startLoop() {
        function frame() {
            renderAll(ctx, canvas, currentAvatarImg);
            animationId = requestAnimationFrame(frame);
        }
        animationId = requestAnimationFrame(frame);
    }

    initTilt();
}

document.addEventListener("DOMContentLoaded", () => {
    const inputs = ["username", "userBio"];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.addEventListener("input", () => {}); }
    });
    if(typeof flatpickr !== 'undefined') {
        flatpickr("#date", {
            dateFormat: "m/d/Y",
            altInput: true,
            altFormat: "F j, Y",
            theme: "dark",
            locale: {
                months: {
                    shorthand: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    longhand: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                }
            }
        });
    }
});

function renderAll(ctx, canvas, avatarImg) {
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let glitchX = 0;
    let glitchY = 0;
    if (isGenerating && Math.random() > 0.8) {
        glitchX = Math.random() * 4 - 2;
        glitchY = Math.random() * 2 - 1;
    }

    ctx.save();
    ctx.translate(glitchX, glitchY);

    // ЧЕРНЫЙ ФОН КАРТОЧКИ
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Мягкий изумрудный градиент в углу
    const topGrad = ctx.createRadialGradient(canvas.width, 0, 50, canvas.width, 0, 450);
    topGrad.addColorStop(0, 'rgba(0, 255, 65, 0.12)');
    topGrad.addColorStop(1, 'rgba(0, 255, 65, 0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Золотой блик внизу
    const bottomGrad = ctx.createRadialGradient(0, canvas.height, 50, 0, canvas.height, 500);
    bottomGrad.addColorStop(0, 'rgba(255, 210, 31, 0.05)');
    bottomGrad.addColorStop(1, 'rgba(255, 210, 31, 0)');
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ИЗУМРУДНЫЕ ЧАСТИЦЫ
    particles.forEach(p => {
        p.y += p.speed;
        if (p.y > 400) p.y = -p.length;
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.length);
        g.addColorStop(0, 'transparent');
        g.addColorStop(1, `rgba(0, 255, 65, ${p.opacity})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + p.length);
        ctx.stroke();
    });

    // Декоративная сетка
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
    for (let x = 0; x < canvas.width; x += 40) {
        for (let y = 0; y < canvas.height; y += 40) {
            ctx.beginPath(); ctx.arc(x, y, 0.6, 0, Math.PI * 2); ctx.fill();
        }
    }
    ctx.restore();

    // Аватар с зеленой рамкой
    const avX = 25, avY = 70, avS = 140;
    ctx.save();
    ctx.strokeStyle = "rgba(0, 255, 65, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(avX, avY, avS, avS);

    if (avatarImg) {
        ctx.drawImage(avatarImg, avX + 1, avY + 1, avS - 2, avS - 2);
    } else {
        ctx.fillStyle = "#111";
        ctx.fillRect(avX + 1, avY + 1, avS - 2, avS - 2);
    }
    ctx.restore();

    // Заголовок
    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "bold 30px Fredoka";
    ctx.shadowColor = "rgba(0, 255, 65, 0.5)";
    ctx.shadowBlur = 10;
    ctx.fillText("USER CARD", 25, 45);
    ctx.restore();

    // Данные пользователя
    const username = document.getElementById("username").value || "sery2013";
    const date = document.getElementById("date").value || "03/12/2026";
    const bioText = document.getElementById("userBio").value || "Web3 Explorer & Content Enthusiast";

    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.strokeRect(185, 65, 580, 50);
    ctx.fillStyle = "white"; ctx.font = "bold 24px Fredoka";
    ctx.fillText(username, 205, 100);

    ctx.fillStyle = "#00ff41"; ctx.font = "16px Fredoka";
    ctx.fillText("Joined: " + date, 205, 150);
    ctx.restore();

    // Роли
    ctx.save();
    const selectedRoles = Array.from(document.querySelectorAll(".roles input[type='checkbox']")).filter(chk => chk.checked).map(chk => chk.value);
    let xStart = 185, yStart = 175;
    selectedRoles.forEach(role => {
        let c1 = "#00ff41", c2 = "#004d0a"; // По умолчанию зеленые
        if (role === "@OG" || role === "@Kah-ching") { c1 = "#ffd21f"; c2 = "#554400"; }
        
        ctx.font = "bold 13px Fredoka";
        const bWidth = ctx.measureText(role).width + 26;
        const g = ctx.createLinearGradient(xStart, yStart, xStart, yStart + 24);
        g.addColorStop(0, c1); g.addColorStop(1, c2);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.roundRect(xStart, yStart, bWidth, 24, 6); ctx.fill();
        ctx.fillStyle = (role === "@OG" || role === "@Kah-ching") ? "black" : "white";
        ctx.fillText(role, xStart + 13, yStart + 16);
        xStart += bWidth + 10;
    });
    ctx.restore();

    // Био
    ctx.save();
    const bioY = yStart + 45;
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    ctx.fillRect(185, bioY, 580, 45);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.strokeRect(185, bioY, 580, 45);
    ctx.fillStyle = "#ccc"; ctx.font = "italic 15px Fredoka";
    ctx.fillText(bioText, 205, bioY + 28);
    ctx.restore();

    // Логотип KAST в твоем золоте
    ctx.save();
    ctx.textAlign = "right";
    const pulse = 10 + Math.sin(Date.now() / 600) * 5;
    ctx.fillStyle = "#ffd21f"; ctx.font = "bold 50px Fredoka";
    ctx.shadowColor = "#ffd21f"; ctx.shadowBlur = pulse;
    ctx.fillText("KAST", 760, 360);
    ctx.restore();

    // Блик "Зеркало"
    reflectionPos += 5; 
    if (reflectionPos > canvas.width + 500) reflectionPos = -500;
    ctx.save();
    const reflectGrad = ctx.createLinearGradient(reflectionPos, 0, reflectionPos + 250, 400);
    reflectGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    reflectGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.04)"); 
    reflectGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = reflectGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.restore();

    // Линия сканирования (при генерации)
    if (isGenerating) {
        scanLineY += 7; 
        if (scanLineY > 400) scanLineY = 0;
        ctx.save();
        ctx.strokeStyle = "#00ff41";
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00ff41";
        ctx.beginPath(); ctx.moveTo(0, scanLineY); ctx.lineTo(canvas.width, scanLineY); ctx.stroke();
        ctx.restore();
    }
}

function downloadCard() {
    playSound("soundClick");
    const canvas = document.getElementById("cardCanvas");
    const link = document.createElement("a");
    link.download = "kast-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

// Анимация фона сайта
(function() {
    const bgCanvas = document.getElementById("bgCanvas");
    if (!bgCanvas) return;
    const bgCtx = bgCanvas.getContext("2d");
    let bgLines = [];
    
    function init() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
        bgLines = Array.from({ length: 60 }, () => ({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * bgCanvas.height,
            speed: Math.random() * 0.8 + 0.2,
            len: Math.random() * 120 + 40,
            op: Math.random() * 0.15
        }));
    }

    function animate() {
        bgCtx.fillStyle = '#000000';
        bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
        
        bgLines.forEach(l => {
            l.y += l.speed;
            if (l.y > bgCanvas.height) { l.y = -l.len; }
            bgCtx.strokeStyle = `rgba(0, 255, 65, ${l.op})`;
            bgCtx.lineWidth = 1;
            bgCtx.beginPath(); 
            bgCtx.moveTo(l.x, l.y); 
            bgCtx.lineTo(l.x, l.y + l.len); 
            bgCtx.stroke();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', init);
    init();
    animate();
})();
