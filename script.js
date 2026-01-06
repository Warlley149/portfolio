document.addEventListener('DOMContentLoaded', ()=>{
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const year = document.getElementById('year');
  year.textContent = new Date().getFullYear();

  toggle.addEventListener('click', ()=>{
    nav.classList.toggle('show');
  });
  // fechar menu mobile ao clicar em um link
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>nav.classList.remove('show')));

  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMessage');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name')||'').toString().trim();
    const email = (fd.get('email')||'').toString().trim();
    const message = (fd.get('message')||'').toString().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!name || !email || !message){
      msg.textContent = 'Por favor, preencha todos os campos.';
      return;
    }
    if(!emailRegex.test(email)){
      msg.textContent = 'Por favor, informe um email válido.';
      return;
    }

    // Método simples para garantir que a mensagem chegue até você:
    // abre o cliente de email do usuário com os campos preenchidos.
    // Substitua 'seu-email@exemplo.com' pelo seu endereço real.
    const recipient = 'warlleysantos199@gmail.com';
    const subject = encodeURIComponent(`Contato do portfolio: ${name}`);
    const body = encodeURIComponent(`Nome: ${name}%0AEmail: ${email}%0A%0AMensagem:%0A${message}`);
    const mailto = `mailto:${recipient}?subject=${subject}&body=${body}`;
    msg.textContent = 'Abrindo cliente de email...';
    // pequena pausa para atualizar a mensagem antes de redirecionar
    setTimeout(()=>{
      window.location.href = mailto;
      form.reset();
    }, 400);
  });

  // animações suaves ao rolar (reveal)
  const revealElems = document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('reveal');
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.12});
    revealElems.forEach(el=>io.observe(el));
  } else {
    revealElems.forEach(el=>el.classList.add('reveal'));
  }
});
