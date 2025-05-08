document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    body.classList.add('dark');
  } else {
    body.classList.remove('dark');
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const newTheme = body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    updateMatrixColor();
  });

  const typingText = document.getElementById('typing-text');
  const cursor = document.getElementById('cursor');
  const text = 'Konstantinos Koumarianos';
  let index = 0;

  function type() {
    if (index < text.length) {
      typingText.textContent += text.charAt(index);
      index++;
      setTimeout(type, 80);
    } else {
      cursor.style.animation = 'glowCursor 1s infinite';
      // Particle burst on typing complete
      createParticleBurst();
    }
  }
  setTimeout(type, 600);

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const elements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(element => observer.observe(element));

  const canvas = document.getElementById('matrix-bg');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const chars = '01{}[]()=><+-*/%#&|ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(0);
  const trails = Array(columns).fill().map(() => []);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px JetBrains Mono`;

    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const yPos = y * fontSize;

      trails[i].push({ char, y: yPos });
      if (trails[i].length > 10) trails[i].shift();
      trails[i].forEach((trail, j) => {
        ctx.fillStyle = `rgba(${body.classList.contains('dark') ? '147, 197, 253' : '29, 78, 216'}, ${1 - j * 0.1})`;
        ctx.fillText(trail.char, x, trail.y);
      });

      ctx.fillStyle = body.classList.contains('dark') ? '#93c5fd' : '#1d4ed8';
      ctx.fillText(char, x, yPos);

      if (yPos > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
        trails[i] = [];
      }
      drops[i]++;
    });
  }

  function updateMatrixColor() {
    ctx.fillStyle = body.classList.contains('dark') ? '#93c5fd' : '#1d4ed8';
  }

  setInterval(drawMatrix, 50);

  function createParticleBurst() {
    const particleCount = 20;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = Math.random() * 5 + 2;
      const particle = {
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 5 + 2,
        alpha: 1,
        char: chars[Math.floor(Math.random() * chars.length)]
      };

      setTimeout(() => animateParticle(particle), i * 50);
    }
  }

  function animateParticle(particle) {
    function draw() {
      ctx.fillStyle = `rgba(${body.classList.contains('dark') ? '147, 197, 253' : '29, 78, 216'}, ${particle.alpha})`;
      ctx.font = `${particle.size}px JetBrains Mono`;
      ctx.fillText(particle.char, particle.x, particle.y);

      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha -= 0.02;
      particle.size *= 0.98;

      if (particle.alpha > 0) {
        requestAnimationFrame(draw);
      }
    }
    draw();
  }

  const snippetContainer = document.getElementById('floating-snippets');
  const snippets = ['local x = 10', 'function init()', 'print("Hello")', 'if true then'];

  function createSnippet() {
    const snippet = document.createElement('div');
    snippet.className = 'absolute text-green-400 font-jetbrains text-sm opacity-0';
    snippet.textContent = snippets[Math.floor(Math.random() * snippets.length)];
    snippet.style.left = `${Math.random() * 100}%`;
    snippet.style.top = `${Math.random() * 100}%`;
    snippetContainer.appendChild(snippet);

    snippet.animate([
      { opacity: 0, transform: 'translateX(0)' },
      { opacity: 0.6, transform: 'translateX(-50px)' },
      { opacity: 0, transform: 'translateX(-100px)' }
    ], {
      duration: 4000,
      easing: 'ease-out',
      fill: 'forwards'
    });

    setTimeout(() => snippet.remove(), 4000);
  }

  setInterval(createSnippet, 1500);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drops.length = Math.floor(canvas.width / fontSize);
    drops.fill(0);
    trails.length = drops.length;
    trails.fill().map(() => []);
  });
});