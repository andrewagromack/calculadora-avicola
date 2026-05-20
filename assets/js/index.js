(function () {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.nav-links');

    if (!toggle || !menu) return;

    function closeMenu() {
      toggle.classList.remove('is-open');
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (event) {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) {
        closeMenu();
      }
    });
  })();
