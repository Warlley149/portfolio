document.addEventListener('DOMContentLoaded', () => {
  // ==================== SETUP INICIAL ====================
  const year = document.getElementById('year');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const themeToggle = document.getElementById('themeToggle');
  const header = document.getElementById('siteHeader');
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  year.textContent = new Date().getFullYear();

  // ==================== TEMA ESCURO/CLARO ====================
  // Detectar preferência do sistema
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  
  const setTheme = (isDark) => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      themeToggle.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      themeToggle.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    }
  };

  // Aplicar tema salvo ou preferência do sistema
  if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
    setTheme(true);
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    setTheme(!isDark);
  });

  // ==================== MOBILE MENU ====================
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.toggle('show');
  });

  // Fechar menu ao clicar num link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('show');
    });
  });

  // Fechar menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-inner')) {
      nav.classList.remove('show');
    }
  });

  // ==================== STICKY HEADER COM SHADOW ====================
  let lastScrollTop = 0;
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 100) {
      header.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
    } else {
      header.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.05)';
    }
    lastScrollTop = scrollTop;
  });

  // ==================== REVEAL ON SCROLL ====================
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Delay gradual para elementos
          const delay = Math.random() * 0.3;
          setTimeout(() => {
            entry.target.classList.add('reveal');
          }, delay * 1000);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('reveal'));
  }

  // ==================== CONTADORES ANIMADOS ====================
  const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 30);
  };

  // Observar quando a seção About fica visível para animar contadores
  const statsContainer = document.querySelector('.stats-container');
  if (statsContainer && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('[data-count]');
          counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            animateCounter(counter, target);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsContainer);
  }

  // ==================== FORMULÁRIO DE CONTATO ====================
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formMessage.textContent = '';
    formMessage.className = 'form-message';

    const fd = new FormData(contactForm);
    const name = (fd.get('name') || '').toString().trim();
    const email = (fd.get('email') || '').toString().trim();
    const subject = (fd.get('subject') || '').toString().trim();
    const message = (fd.get('message') || '').toString().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validações
    if (!name || !email || !message) {
      formMessage.textContent = '❌ Por favor, preencha todos os campos obrigatórios.';
      formMessage.classList.add('error');
      return;
    }

    if (!emailRegex.test(email)) {
      formMessage.textContent = '❌ Por favor, informe um email válido.';
      formMessage.classList.add('error');
      return;
    }

    if (message.length < 10) {
      formMessage.textContent = '❌ A mensagem deve ter pelo menos 10 caracteres.';
      formMessage.classList.add('error');
      return;
    }

    // Animação de envio
    const originalText = e.target.textContent;
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Abrindo email...';

    // Construir mailto
    const recipient = 'warlleysantos199@gmail.com';
    const subjectEncoded = encodeURIComponent(`Contato do Portfolio: ${subject || name}`);
    const bodyEncoded = encodeURIComponent(
      `Nome: ${name}\nEmail: ${email}\nAssunto: ${subject || 'Sem assunto'}\n\nMensagem:\n${message}`
    );
    const mailto = `mailto:${recipient}?subject=${subjectEncoded}&body=${bodyEncoded}`;

    // Feedback de sucesso
    formMessage.textContent = '✅ Mensagem enviada com sucesso! Redirecionando...';
    formMessage.classList.add('success');

    setTimeout(() => {
      // Tentar abrir email em background
      const img = new Image();
      img.src = mailto;
      
      // Redirecionar para página de agradecimento
      setTimeout(() => {
        window.location.href = 'obrigado.html';
      }, 500);
    }, 800);
  });

  // ==================== EFEITO PARALLAX SUAVE ====================
  const parallaxElements = document.querySelectorAll('.profile-wrapper');
  
  window.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth) * 20 - 10;
    const mouseY = (e.clientY / window.innerHeight) * 20 - 10;

    parallaxElements.forEach(el => {
      el.style.transform = `perspective(1000px) rotateX(${mouseY * 0.5}deg) rotateY(${mouseX * 0.5}deg)`;
    });
  });

  // Reset ao sair do viewport
  document.addEventListener('mouseleave', () => {
    parallaxElements.forEach(el => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });

  // ==================== SCROLL SUAVE PARA ÂNCORAS ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ==================== EFEITO DE HOVER NAS SKILLS ====================
  document.querySelectorAll('.skill-badge').forEach(badge => {
    badge.addEventListener('mouseenter', function() {
      this.style.animation = 'none';
      setTimeout(() => {
        this.style.animation = '';
      }, 10);
    });
  });

  // ==================== ANALYTICS SIMPLES ====================
  // Rastrear seções visualizadas
  const sectionsViewed = new Set();
  
  document.querySelectorAll('section[id]').forEach(section => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sectionsViewed.add(entry.target.id);
          console.log(`📍 Visualizou seção: ${entry.target.id}`);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(section);
  });

  // ==================== TECLADO - NAVEGAÇÃO COM SETAS ====================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      window.scrollBy(0, 100);
    } else if (e.key === 'ArrowUp') {
      window.scrollBy(0, -100);
    }
  });

  // ==================== PRELOAD LAZY IMAGES ====================
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          imageObserver.unobserve(img);
        }
      });
    });
    images.forEach(img => imageObserver.observe(img));
  }

  // ==================== RIPPLE EFFECT NOS BOTÕES ====================
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.background = 'rgba(255, 255, 255, 0.6)';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple-animation 0.6s ease-out';
      ripple.style.pointerEvents = 'none';

      // Adicionar CSS da animação se não existir
      if (!document.querySelector('style[data-ripple]')) {
        const style = document.createElement('style');
        style.setAttribute('data-ripple', 'true');
        style.textContent = `
          @keyframes ripple-animation {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ==================== FADE IN GRADUAL DAS SKILLS ====================
  const skills = document.querySelectorAll('.skill-badge');
  skills.forEach((skill, index) => {
    skill.style.opacity = '0';
    skill.style.transform = 'translateY(10px)';
    skill.style.transition = `all 0.3s ease ${index * 50}ms`;
    
    setTimeout(() => {
      skill.style.opacity = '1';
      skill.style.transform = 'translateY(0)';
    }, 100);
  });

  console.log('✨ Portfólio carregado com sucesso!');
});
