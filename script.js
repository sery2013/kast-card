// --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ---
let particles = [];
let animationId = null;
let scanLineY = 0;
let isGenerating = false;
let currentAvatarImg = null;
let reflectionPos = -500;
let mouseX = 0;
let mouseY = 0;

// ПЕРЕМЕННЫЕ ДЛЯ ВЫБОРА КАРТОЧЕК
let selectedCardImage = null;
let selectedCardName = null;

// ССЫЛКИ НА КАРТОЧКИ
const cardImages = {
    "1": "https://raw.githubusercontent.com/sery2013/kast-card/main/Bitcoin-Black-Card.png",
    "2": "https://raw.githubusercontent.com/sery2013/kast-card/main/Founders-Edition.png",
    "3": "https://raw.githubusercontent.com/sery2013/kast-card/main/K-Card.png",
    "4": "https://raw.githubusercontent.com/sery2013/kast-card/main/Solana-Card.png",
    "5": "https://raw.githubusercontent.com/sery2013/kast-card/main/Solana-Gold-Card.png",
    "6": "https://raw.githubusercontent.com/sery2013/kast-card/main/Solana-Illuma-Card.png",
    "7": "https://raw.githubusercontent.com/sery2013/kast-card/main/Solana-Solid-Gold-Card.png",
    "8": "https://raw.githubusercontent.com/sery2013/kast-card/main/X-Card.png",
    "9": "https://raw.githubusercontent.com/sery2013/kast-card/main/design-card.png",
    "10": "https://raw.githubusercontent.com/sery2013/kast-card/main/pengu-black.png",
    "11": "https://raw.githubusercontent.com/sery2013/kast-card/main/pengu-gold.png",
    "12": "https://raw.githubusercontent.com/sery2013/kast-card/main/pengu-white.png"
};

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

// Инициализация выбора карточек
function initCardSelector() {
    const options = document.querySelectorAll('.card-option');
    
    // Загружаем первую карточку по умолчанию
    loadCardImage("1");
    
    options.forEach(option => {
        option.addEventListener('click', () => {
            playSound("soundClick");
            
            options.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            
            const cardId = option.dataset.card;
            selectedCardName = option.dataset.name;
            loadCardImage(cardId);
        });
    });
}

function loadCardImage(cardId) {
    const imgUrl = cardImages[cardId];
    if (!imgUrl) return;
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        selectedCardImage = img;
        console.log(`✅ Card ${cardId} (${selectedCardName}) loaded`);
        const canvas = document.getElementById("cardCanvas");
        if (canvas && canvas.style.display !== "none") {
            const ctx = canvas.getContext("2d");
            renderAll(ctx, canvas, currentAvatarImg);
        }
    };
    img.onerror = () => {
        console.error(`❌ Failed to load card ${cardId}`);
        selectedCardImage = null;
    };
    img.src = imgUrl;
}

function initDigitalFlow() {
    particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * 800,
            y: Math.random() * 400,
            speed: Math.random() * 1.5 + 0.5,
            length: Math.random() * 80 + 30,
            opacity: Math.random() * 0.4
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
    
    canvas.style.display = "block";
    skeleton.style.display = "none";
    
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
    
    // Слушатель смены темы
    const themeSelect = document.getElementById("theme-mode");
    if(themeSelect) {
        themeSelect.addEventListener("change", () => {
            const canvas = document.getElementById("cardCanvas");
            if (canvas && canvas.style.display !== "none") {
                const ctx = canvas.getContext("2d");
                renderAll(ctx, canvas, currentAvatarImg);
            }
        });
    }

    initCardSelector();
    
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
    const theme = document.getElementById("theme-mode").value;
    const isDark = theme === "dark";

    const colorMainText = isDark ? "#ffffff" : "#1a1a1a";
    const colorAccent = isDark ? "#00f2ff" : "#0088aa";
    const colorSecondaryText = isDark ? "#00f2ff" : "#0088aa";
    const colorBoxBg = isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)";
    const colorBoxStroke = isDark ? "rgba(0, 242, 255, 0.3)" : "rgba(0, 136, 170, 0.3)";
    const colorEmptyAvatar = isDark ? "#0a0a0a" : "#e0e0e0";
    const colorBio = isDark ? "#eeeeee" : "#444444";
    const colorBioBox = isDark ? "rgba(0, 242, 255, 0.05)" : "rgba(0, 136, 170, 0.05)";
    const shadowColorText = isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)";
    const colorLineGradStart = isDark ? "rgba(0, 242, 255, 0)" : "rgba(0, 136, 170, 0)";
    const colorLineGradEnd = isDark ? "rgba(0, 242, 255, 0.5)" : "rgba(0, 136, 170, 0.5)";

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
    
    // === ФОН: ВЫБРАННАЯ КАРТОЧКА ===
    if (selectedCardImage) {
        ctx.save();
        const scale = Math.max(canvas.width / selectedCardImage.width, 
                              canvas.height / selectedCardImage.height);
        const x = (canvas.width - selectedCardImage.width * scale) / 2;
        const y = (canvas.height - selectedCardImage.height * scale) / 2;
        ctx.drawImage(selectedCardImage, x, y, 
                     selectedCardImage.width * scale, 
                     selectedCardImage.height * scale);
        ctx.restore();
    } else {
        ctx.fillStyle = isDark ? '#000000' : '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Эффекты поверх карточки
    const topGrad = ctx.createRadialGradient(canvas.width, 0, 50, canvas.width, 0, 400);
    topGrad.addColorStop(0, isDark ? 'rgba(0, 242, 255, 0.15)' : 'rgba(0, 136, 170, 0.15)');
    topGrad.addColorStop(1, 'rgba(0, 242, 255, 0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const bottomGrad = ctx.createRadialGradient(0, canvas.height, 50, 0, canvas.height, 500);
    bottomGrad.addColorStop(0, isDark ? 'rgba(0, 242, 255, 0.1)' : 'rgba(0, 136, 170, 0.1)');
    bottomGrad.addColorStop(1, 'rgba(0, 242, 255, 0)');
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Частицы
    particles.forEach(p => {
        p.y += p.speed;
        if (p.y > 400) p.y = -p.length;
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.length);
        g.addColorStop(0, 'transparent');
        g.addColorStop(1, isDark ? `rgba(0, 242, 255, ${p.opacity})` : `rgba(0, 136, 170, ${p.opacity})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + p.length);
        ctx.stroke();
        ctx.fillStyle = isDark ? `rgba(0, 242, 255, ${p.opacity * 2})` : `rgba(0, 136, 170, ${p.opacity * 2})`;
        ctx.beginPath(); ctx.arc(p.x, p.y + p.length, 1, 0, Math.PI * 2); ctx.fill();
    });
    
    // Сетка точек
    ctx.save();
    ctx.fillStyle = isDark ? "rgba(0, 242, 255, 0.03)" : "rgba(0, 136, 170, 0.03)";
    for (let x = 0; x < canvas.width; x += 30) {
        for (let y = 0; y < canvas.height; y += 30) {
            ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI * 2); ctx.fill();
        }
    }
    ctx.fillStyle = isDark ? "rgba(0, 242, 255, 0.04)" : "rgba(0, 136, 170, 0.04)";
    ctx.font = "bold 40px Fredoka";
    const symbols = ["()", "KAST", "*", "◇"];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 6; j++) {
            ctx.save();
            ctx.translate(i * 120, j * 90);
            ctx.rotate(-Math.PI / 10);
            ctx.fillText(symbols[(i + j) % symbols.length], 0, 0);
            ctx.restore();
        }
    }
    ctx.restore();
    
    // Аватар
    const avX = 25, avY = 70, avS = 140;
    ctx.save();
    ctx.strokeStyle = colorAccent;
    ctx.lineWidth = 2;
    ctx.strokeRect(avX, avY, avS, avS);
    
    if (avatarImg) {
        if (isGenerating && Math.random() > 0.85) {
            ctx.globalAlpha = 0.5;
            ctx.drawImage(avatarImg, avX + 5, avY, avS - 2, avS - 2);
            ctx.globalAlpha = 1;
        }
        ctx.drawImage(avatarImg, avX + 1, avY + 1, avS - 2, avS - 2);
    } else {
        ctx.fillStyle = colorEmptyAvatar;
        ctx.fillRect(avX + 1, avY + 1, avS - 2, avS - 2);
    }
    ctx.restore();
    
    // Заголовок USER CARD
    ctx.save();
    ctx.fillStyle = colorMainText;
    ctx.font = "bold 30px Fredoka";
    ctx.shadowColor = shadowColorText;
    ctx.shadowBlur = 15;
    ctx.fillText("USER CARD", 25, 45);
    ctx.restore();
    
    // Линия
    ctx.save();
    const lineGrad = ctx.createLinearGradient(275, 0, 765, 0);
    lineGrad.addColorStop(0, colorLineGradStart);
    lineGrad.addColorStop(0.5, colorLineGradEnd);
    lineGrad.addColorStop(1, colorLineGradStart);
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(275, 35); ctx.lineTo(765, 35); ctx.stroke();
    ctx.restore();
    
    // Username и дата
    const username = document.getElementById("username").value || "sery2013";
    const date = document.getElementById("date").value || "03/12/2026";
    const bioText = document.getElementById("userBio").value || "Web3 Explorer & Content Enthusiast";
    
    // Блок Username
    ctx.save();
    ctx.fillStyle = colorBoxBg;
    ctx.strokeStyle = colorBoxStroke;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(185, 65, 580, 50, 8); ctx.fill(); ctx.stroke();
    
    ctx.fillStyle = colorMainText; 
    ctx.font = "bold 24px Fredoka";
    ctx.shadowColor = "transparent";
    ctx.fillText(username, 205, 97);
    ctx.restore();
    
    // Блок Joined
    ctx.save();
    ctx.fillStyle = colorBoxBg;
    ctx.strokeStyle = colorBoxStroke;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(185, 125, 580, 40, 8); ctx.fill(); ctx.stroke();
    
    ctx.fillStyle = colorSecondaryText; 
    ctx.font = "18px Fredoka";
    ctx.fillText("Joined: " + date, 205, 152);
    ctx.restore();
    
    // Роли
    ctx.save();
    const selectedRoles = Array.from(document.querySelectorAll(".roles input[type='checkbox']")).filter(chk => chk.checked).map(chk => chk.value);
    let xStart = 185, yStart = 180;
    selectedRoles.forEach(role => {
        let c1, c2;
        if (role === "@Staff") { c1 = "#004e52"; c2 = "#00f2ff"; }
        else if (role === "@KAST Evangelist") { c1 = "#005a5d"; c2 = "#00f2ff"; }
        else if (role === "@OG") { c1 = "#006a6e"; c2 = "#ffffff"; }
        else if (role === "@Kah-ching") { c1 = "#005558"; c2 = "#00f2ff"; }
        else if (role === "@KAST Creator") { c1 = "#006063"; c2 = "#ffffff"; }
        else { c1 = "#002a2c"; c2 = "#00f2ff"; }
        
        if (!isDark) {
             c1 = "#003333"; 
             c2 = "#005566";
        }
        
        ctx.font = "bold 13px Fredoka";
        const bWidth = ctx.measureText(role).width + 26;
        if(xStart + bWidth > canvas.width - 20) { xStart = 185; yStart += 35; }
        
        const g = ctx.createLinearGradient(xStart, yStart, xStart, yStart + 25);
        g.addColorStop(0, c2); g.addColorStop(1, c1);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.roundRect(xStart, yStart, bWidth, 25, 6); ctx.fill();
        
        ctx.fillStyle = isDark ? ((role === "@OG" || role === "@KAST Creator") ? "#000000" : "#ffffff") : "#ffffff";
        ctx.fillText(role, xStart + 13, yStart + 17);
        xStart += bWidth + 10;
    });
    ctx.restore();
    
    // Био
    ctx.save();
    const bioY = yStart + 45;
    ctx.fillStyle = colorBioBox;
    ctx.strokeStyle = colorBoxStroke;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(185, bioY, 580, 45, 8); ctx.fill(); ctx.stroke();
    
    ctx.fillStyle = colorBio; 
    ctx.font = "italic 16px Fredoka";
    ctx.shadowColor = "transparent";
    ctx.fillText(bioText, 205, bioY + 28);
    ctx.restore();
    
    // Соцсети
    ctx.save();
    const sY = bioY + 145;
    ctx.font = "14px Fredoka"; ctx.fillStyle = colorMainText;
    
    const drawIcon = (x, y, color, type) => {
        ctx.save(); ctx.translate(x, y - 12); ctx.fillStyle = color;
        if (type === 'tg') {
            ctx.beginPath(); ctx.moveTo(0, 7); ctx.lineTo(15, 0); ctx.lineTo(13, 15); ctx.lineTo(9, 10); ctx.lineTo(9, 14); ctx.lineTo(7, 10); ctx.fill();
        } else if (type === 'x') {
            ctx.font = "bold 15px Arial"; ctx.fillStyle = colorMainText; ctx.fillText("𝕏", 0, 13);
        } else if (type === 'dc') {
            const s = 0.8; ctx.scale(s, s);
            ctx.beginPath();
            ctx.moveTo(1.8, 2.5);
            ctx.bezierCurveTo(3.2, 0.8, 5.8, 0.2, 9, 0.2);
            ctx.bezierCurveTo(12.2, 0.2, 14.8, 0.8, 16.2, 2.5);
            ctx.lineTo(17.5, 4.2);
            ctx.bezierCurveTo(18.5, 7.5, 18.2, 10.8, 16.5, 13.5);
            ctx.lineTo(15.2, 15.3);
            ctx.bezierCurveTo(13.8, 14.5, 12.5, 13.5, 11.5, 12.2);
            ctx.lineTo(10.8, 13.5);
            ctx.lineTo(9.5, 15.5);
            ctx.lineTo(8.2, 13.5);
            ctx.lineTo(7.5, 12.2);
            ctx.bezierCurveTo(6.5, 13.5, 5.2, 14.5, 3.8, 15.3);
            ctx.lineTo(2.5, 13.5);
            ctx.bezierCurveTo(0.8, 10.8, 0.5, 7.5, 1.5, 4.2);
            ctx.closePath();
            ctx.fill();
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(6.2, 7.8, 2.2, 0, Math.PI * 2);
            ctx.arc(11.8, 7.8, 2.2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    };
    drawIcon(185, sY, colorAccent, 'x'); ctx.fillText("Twitter", 207, sY);
    drawIcon(285, sY, colorAccent, 'tg'); ctx.fillText("Telegram", 307, sY);
    drawIcon(395, sY, colorAccent, 'dc'); ctx.fillText("Discord", 417, sY);
    ctx.fillText("🌐 kast.xyz", 505, sY);
    ctx.restore();
    
    // [УДАЛЕН БЛОК С ЛОГОТИПОМ KAST, ЧТОБЫ НЕ ЗАКРЫВАТЬ ФОН]
    
    // QR код
    const qrSrc = "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://kast.xyz";
    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.src = qrSrc;
    if (qrImg.complete) {
        ctx.drawImage(qrImg, 35, 245, 120, 120);
        ctx.fillStyle = colorSecondaryText; ctx.font = "10px Fredoka"; ctx.textAlign = "center";
        ctx.fillText("kast.xyz", 95, 380);
    }
    
    // Глитч эффект
    if (isGenerating && Math.random() > 0.9) {
        ctx.fillStyle = isDark ? "rgba(0, 242, 255, 0.15)" : "rgba(0, 136, 170, 0.15)";
        ctx.fillRect(0, Math.random() * 400, 800, Math.random() * 40);
    }
    
    // Блик
    reflectionPos += 4;
    if (reflectionPos > canvas.width + 500) reflectionPos = -500;
    ctx.save();
    const reflectGrad = ctx.createLinearGradient(reflectionPos, 0, reflectionPos + 300, 400);
    reflectGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    reflectGrad.addColorStop(0.5, isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.3)");
    reflectGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = reflectGrad;
    ctx.globalCompositeOperation = "overlay";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    ctx.restore();
    
    // Сканирующая линия
    if (isGenerating) {
        scanLineY += 8;
        if (scanLineY > 400) scanLineY = 0;
        ctx.save();
        let scanGrad = ctx.createLinearGradient(0, scanLineY - 40, 0, scanLineY);
        scanGrad.addColorStop(0, "transparent");
        scanGrad.addColorStop(1, isDark ? "rgba(0, 242, 255, 0.4)" : "rgba(0, 136, 170, 0.4)");
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanLineY - 40, canvas.width, 40);
        ctx.strokeStyle = colorAccent;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = colorAccent;
        ctx.beginPath(); ctx.moveTo(0, scanLineY); ctx.lineTo(canvas.width, scanLineY); ctx.stroke();
        ctx.restore();
    }
}

function downloadCard() {
    playSound("soundClick");
    const canvas = document.getElementById("cardCanvas");
    if (canvas.style.display === "none") return;
    
    const link = document.createElement("a");
    link.download = "kast-animated-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

// Фоновая анимация
(function() {
    const bgCanvas = document.getElementById("bgCanvas");
    if (!bgCanvas) return;
    const bgCtx = bgCanvas.getContext("2d");
    let bgLines = [];
    
    function init() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
        bgLines = Array.from({ length: 80 }, () => ({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * bgCanvas.height,
            speed: Math.random() * 1 + 0.5,
            len: Math.random() * 100 + 50,
            op: Math.random() * 0.3
        }));
    }
    
    function animate() {
        bgCtx.fillStyle = '#000000';
        bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
        
        bgLines.forEach(l => {
            let dx = mouseX - l.x;
            let dy = mouseY - l.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            let currentSpeed = l.speed;
            
            if (dist < 250) {
                currentSpeed += (1 - dist/250) * 6;
            }
            
            l.y += currentSpeed;
            if (l.y > bgCanvas.height) {
                l.y = -l.len;
                l.x = Math.random() * bgCanvas.width;
            }
            
            let g = bgCtx.createLinearGradient(0, l.y, 0, l.y + l.len);
            g.addColorStop(0, 'transparent');
            g.addColorStop(1, `rgba(0, 242, 255, ${l.op})`);
            bgCtx.strokeStyle = g;
            bgCtx.lineWidth = 1.2;
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
