document.addEventListener('DOMContentLoaded', () => {
  // ── HEADER SCROLL BEHAVIOR ──
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ── MOBILE MENU ──
  const burgerBtn = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      const isActive = mobileMenu.classList.contains('active');
      burgerBtn.setAttribute('aria-expanded', isActive);
      burgerBtn.innerHTML = isActive 
        ? '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
        : '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>';
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        burgerBtn.setAttribute('aria-expanded', 'false');
        burgerBtn.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>';
      });
    });

    const mobileServicosToggle = document.getElementById('mobile-servicos-toggle');
    const mobileSubmenu = document.getElementById('mobile-submenu');
    if (mobileServicosToggle && mobileSubmenu) {
      mobileServicosToggle.addEventListener('click', () => {
        const isOpen = mobileSubmenu.classList.contains('open');
        mobileSubmenu.classList.toggle('open');
        mobileServicosToggle.querySelector('.icon').innerHTML = isOpen
          ? '+'
          : '-';
      });
    }
  }

  // ── COOKIE BANNER ──
  const cookieBanner = document.getElementById('cookie-banner');
  const btnAccept = document.getElementById('cookie-accept');
  const btnDecline = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookie-consent')) {
    setTimeout(() => {
      cookieBanner.classList.add('show');
    }, 200);
  }

  if (btnAccept && cookieBanner) {
    btnAccept.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'accepted');
      cookieBanner.classList.remove('show');
    });
  }

  if (btnDecline && cookieBanner) {
    btnDecline.addEventListener('click', () => {
      cookieBanner.classList.remove('show');
    });
  }

  // ── FORM VALIDATION & SUBMIT ──
  const contactForm = document.getElementById('contact-form');
  const assuntoSelect = document.getElementById('assunto');
  const formFeedback = document.getElementById('form-feedback');

  if (assuntoSelect) {
    const urlParams = new URLSearchParams(window.location.search);
    const assuntoParam = urlParams.get('assunto');
    if (assuntoParam) {
      const optionExists = Array.from(assuntoSelect.options).some(opt => opt.value === assuntoParam);
      if (optionExists) {
        assuntoSelect.value = assuntoParam;
        assuntoSelect.classList.add('filled');
      }
    }
  }

  // Add .filled class on blur if it has value
  const inputs = document.querySelectorAll('.form-control');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value.trim() !== '') {
        input.classList.add('filled');
      } else {
        input.classList.remove('filled');
      }
    });
  });

  const validateField = (id, condition, errorMsg) => {
    const el = document.getElementById(id);
    if (!el) return true;
    const errorEl = document.getElementById(`${id}-error`);
    
    if (condition(el.value.trim())) {
      el.classList.add('error');
      el.setAttribute('aria-invalid', 'true');
      if (errorEl) errorEl.textContent = errorMsg;
      return false;
    } else {
      el.classList.remove('error');
      el.setAttribute('aria-invalid', 'false');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  };

  if (contactForm) {
    const validateForm = () => {
      let isValid = true;
      
      const isNameValid = validateField('nome', 
        val => val === '' || val.length < 3, 
        val === '' ? 'Nome é obrigatório' : 'Nome deve ter pelo menos 3 caracteres'
      );
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmailValid = validateField('email',
        val => val === '' || !emailRegex.test(val),
        val === '' ? 'E-mail é obrigatório' : 'E-mail inválido (exemplo: seu@email.com)'
      );

      const isAssuntoValid = validateField('assunto',
        val => val === '',
        'Selecione um assunto'
      );

      const isMensagemValid = validateField('mensagem',
        val => val === '' || val.length < 10,
        val === '' ? 'Mensagem é obrigatória' : 'Mensagem deve ter pelo menos 10 caracteres'
      );

      return isNameValid && isEmailValid && isAssuntoValid && isMensagemValid;
    };

    // Real-time validation on blur
    ['nome', 'email', 'assunto', 'mensagem'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('blur', () => {
          if (id === 'nome') validateField('nome', val => val === '' || val.length < 3, val === '' ? 'Nome é obrigatório' : 'Nome deve ter pelo menos 3 caracteres');
          if (id === 'email') validateField('email', val => val === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), val === '' ? 'E-mail é obrigatório' : 'E-mail inválido (exemplo: seu@email.com)');
          if (id === 'assunto') validateField('assunto', val => val === '', 'Selecione um assunto');
          if (id === 'mensagem') validateField('mensagem', val => val === '' || val.length < 10, val === '' ? 'Mensagem é obrigatória' : 'Mensagem deve ter pelo menos 10 caracteres');
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!validateForm()) return;

      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const empresa = document.getElementById('empresa') ? document.getElementById('empresa').value : '';
      const assunto = document.getElementById('assunto').value;
      const mensagem = document.getElementById('mensagem').value;

      const submitBtn = document.getElementById('submit-btn');
      const btnText = document.getElementById('btn-text');
      const originalText = btnText ? btnText.textContent : submitBtn.textContent;
      
      submitBtn.classList.add('loading');
      if (btnText) btnText.textContent = 'Enviando...';
      submitBtn.disabled = true;

      // Simulate network request
      setTimeout(() => {
        try {
          const mailtoLink = `mailto:contato@redoclub.com.br?subject=${encodeURIComponent(assunto + ' - ' + nome)}&body=${encodeURIComponent('Nome: ' + nome + '\nE-mail: ' + email + '\nEmpresa: ' + (empresa || 'Não informada') + '\n\nMensagem:\n' + mensagem)}`;
          window.location.href = mailtoLink;

          contactForm.reset();
          inputs.forEach(input => input.classList.remove('filled'));
          submitBtn.classList.remove('loading');
          if (btnText) btnText.textContent = originalText;
          submitBtn.disabled = false;

          formFeedback.textContent = 'Obrigado! Vamos responder em breve.';
          formFeedback.style.color = 'var(--accent)';
          formFeedback.style.display = 'block';

        } catch (error) {
          submitBtn.classList.remove('loading');
          if (btnText) btnText.textContent = 'Tentar novamente';
          submitBtn.disabled = false;
          
          formFeedback.textContent = 'Algo deu errado. Tente novamente.';
          formFeedback.style.color = '#ef4444';
          formFeedback.style.display = 'block';
        }
      }, 800);
    });
  }
});
