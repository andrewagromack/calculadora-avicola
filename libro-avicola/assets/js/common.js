(function(){
  const button = document.querySelector('.global-menu-toggle');
  const menu = document.querySelector('#global-menu');
  if(!button || !menu) return;

  function closeMenu(){
    button.classList.remove('is-open');
    menu.classList.remove('is-open');
    button.setAttribute('aria-expanded','false');
  }

  button.addEventListener('click', function(){
    const open = button.classList.toggle('is-open');
    menu.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  menu.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function(e){
    if(!menu.contains(e.target) && !button.contains(e.target)) closeMenu();
  });

  window.addEventListener('resize', function(){
    if(window.innerWidth > 860) closeMenu();
  });
})();
