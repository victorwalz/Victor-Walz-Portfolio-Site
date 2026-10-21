/**
 * WalzDEV - Script Principal (script.js)
 * Autor: Victor Walz
 * Funcionalidades interativas da Landing Page
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const faqItems = document.querySelectorAll('.faq-item');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailAddress = document.getElementById('email-address');
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');
  const toast = document.getElementById('toast');

  /* --------------------------------------------------------------------------
     1. Header Dinâmico com Sombra no Scroll
     -------------------------------------------------------------------------- */
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --------------------------------------------------------------------------
     2. Menu Mobile (Hambúrguer)
     -------------------------------------------------------------------------- */
  const toggleMobileMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen);
  };

  const closeMobileMenu = () => {
    navMenu.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileMenu);
  }

  // Fechar menu mobile ao clicar em um link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* --------------------------------------------------------------------------
     3. ScrollSpy: Destacar link ativo conforme a rolagem
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  /* --------------------------------------------------------------------------
     4. Filtros de Projetos Recentes
     -------------------------------------------------------------------------- */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     5. Acordeão de FAQs (Perguntas Frequentes)
     -------------------------------------------------------------------------- */
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha todos os outros itens para um efeito mais limpo
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBtn = otherItem.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Se não estava ativo, abre
      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* --------------------------------------------------------------------------
     6. Função Helper de Notificação Toast
     -------------------------------------------------------------------------- */
  let toastTimeout;
  const showToast = (message, duration = 3500) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  /* --------------------------------------------------------------------------
     7. Copiar E-mail para a Área de Transferência
     -------------------------------------------------------------------------- */
  if (copyEmailBtn && emailAddress) {
    copyEmailBtn.addEventListener('click', async () => {
      const textToCopy = emailAddress.textContent.trim();
      try {
        await navigator.clipboard.writeText(textToCopy);
        const icon = copyEmailBtn.querySelector('i');
        icon.className = 'fa-solid fa-check';
        showToast('E-mail copiado para a área de transferência! 📋');

        setTimeout(() => {
          icon.className = 'fa-regular fa-copy';
        }, 2200);
      } catch (err) {
        // Fallback para navegadores legados
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('E-mail copiado! 📋');
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. Formulário de Contato com Validação e Feedback
     -------------------------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !subject || !message) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Por favor, preencha todos os campos obrigatórios.';
        return;
      }

      // Efeito de envio
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Enviando...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;

        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `Obrigado pelo contato, <strong>${name}</strong>! Sua mensagem foi enviada com sucesso. Retornarei em breve.`;
        
        showToast('Mensagem enviada com sucesso! 🚀');
        contactForm.reset();

        setTimeout(() => {
          formFeedback.style.display = 'none';
          formFeedback.className = 'form-feedback';
        }, 6000);
      }, 1200);
    });
  }
});

