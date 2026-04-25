// 1. 魔法鼠标轨迹
const cursor = document.getElementById('magic-cursor');
let cursorX = 0, cursorY = 0;
let isMoving = false;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    
    // 生成魔法粒子
    if (Math.random() > 0.5) {
        createSparkle(e.clientX, e.clientY);
    }
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'magic-sparkle';
    
    // 随机大小和偏移
    const size = Math.random() * 8 + 4;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    
    const offsetX = (Math.random() - 0.5) * 40;
    const offsetY = (Math.random() - 0.5) * 40;
    
    sparkle.style.left = `${x + offsetX}px`;
    sparkle.style.top = `${y + offsetY}px`;
    sparkle.style.setProperty('--y', `${y + offsetY}px`); // 用于CSS动画往下落
    
    document.body.appendChild(sparkle);
    
    // 动画结束后移除
    setTimeout(() => {
        sparkle.remove();
    }, 800);
}

// 2. 视差滚动
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroBg = document.getElementById('hero-bg');
    
    if (heroBg && scrollY < window.innerHeight) {
        heroBg.style.transform = `translateZ(0) translateY(${scrollY * 0.4}px)`;
    }
});

// 3. 滚动显形 (Scroll Reveal)
const revealItems = document.querySelectorAll('.reveal-item');

const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealItems.forEach(item => {
    revealOnScroll.observe(item);
});

// 4. 属性克制互动轮盘
const elementNodes = document.querySelectorAll('.element-node');
const feedbackText = document.getElementById('element-feedback');

elementNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
        const type = node.getAttribute('data-type');
        const counters = node.getAttribute('data-counters');
        const weak = node.getAttribute('data-weak');
        
        // 中文名称映射
        const nameMap = { 'fire': '火', 'water': '水', 'grass': '草' };
        
        feedbackText.innerHTML = `<span style="color:${getColor(type)}">${nameMap[type]}</span> 克制 <span style="color:${getColor(counters)}">${nameMap[counters]}</span>，被 <span style="color:${getColor(weak)}">${nameMap[weak]}</span> 克制`;
        
        // 样式高亮处理可以加在这里，目前先用文字反馈
    });
    
    node.addEventListener('mouseleave', () => {
        feedbackText.innerHTML = '悬停以查看关系';
    });
});

function getColor(type) {
    if(type === 'fire') return '#ff3d00';
    if(type === 'water') return '#00e5ff';
    if(type === 'grass') return '#76ff03';
    return '#fff';
}

// 5. 咕噜球捕捉模拟器
const elves = [
    { name: '喵喵', color: '#76ff03' },
    { name: '火花', color: '#ff3d00' },
    { name: '水蓝蓝', color: '#00e5ff' },
    { name: '迪莫', color: '#ffdb58' }
];

function throwBall() {
    const ball = document.getElementById('gulu-ball');
    const grass = document.getElementById('grass-patch');
    const resultBox = document.getElementById('catch-result');
    
    if (ball.classList.contains('throwing')) return; // 防止重复点击
    
    ball.classList.add('throwing');
    resultBox.style.opacity = '0';
    grass.innerHTML = "✨ 捕捉中...";
    
    setTimeout(() => {
        ball.classList.remove('throwing');
        
        // 随机捕获
        const isCaught = Math.random() > 0.3; // 70% 概率捕获
        
        if (isCaught) {
            const caughtElf = elves[Math.floor(Math.random() * elves.length)];
            resultBox.innerHTML = `🎉 恭喜！你抓到了 <span style="color:${caughtElf.color}; text-shadow: 0 0 10px ${caughtElf.color}">${caughtElf.name}</span>！`;
            resultBox.style.color = '#fff';
            grass.innerHTML = "🌿 草丛恢复了平静";
        } else {
            resultBox.innerHTML = `💨 哎呀，精灵逃跑了...`;
            resultBox.style.color = '#ff6b6b';
            grass.innerHTML = "🌿 草丛还在晃动...";
        }
        
        resultBox.style.opacity = '1';
        
    }, 1000);
}

// 6. 平滑滚动导航
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({
        behavior: 'smooth'
    });
}
