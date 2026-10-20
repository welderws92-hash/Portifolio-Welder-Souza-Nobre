document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const backToTop = document.getElementById('back-to-top');
  const year = document.getElementById('year');

  if (year) year.textContent = new Date().getFullYear();

  // Menu móvel: fecha após escolher uma seção e mantém aria-expanded sincronizado.
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
      navLinks.classList.toggle('open', !isOpen);
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
      });
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
        menuToggle.focus();
      }
    });
  }

  // Filtro de projetos com botões acessíveis.
  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('.project-card[data-category]');
  const projectCount = document.getElementById('project-count');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      let visibleCount = 0;
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      projectCards.forEach(card => {
        const categories = (card.dataset.category || '').split(/\s+/);
        const visible = filter === 'all' || categories.includes(filter);
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      if (projectCount) {
        projectCount.textContent = `${String(visibleCount).padStart(2, '0')} PROJETO${visibleCount === 1 ? '' : 'S'}`;
      }
    });
  });

  // Animações de entrada respeitam a preferência por movimento reduzido.
  const revealItems = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Botão de retorno ao topo.
  const updateBackToTop = () => {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 550);
  };
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  // Para ativar o LinkedIn pessoal, substitua a URL de exemplo pela URL pública do perfil.
  // Não há scraping nem token de API no navegador. O arquivo é estático e não guarda credenciais.
});