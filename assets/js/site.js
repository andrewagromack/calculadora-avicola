// ============================================================
// Herramientas gratis: UTM ocultos + abrir la tarjeta de guardado.
// No depende de ninguna librería; corre en cualquiera de las 3 páginas.
// ============================================================
(function () {
  // Captura utm_source / utm_campaign / utm_content de la URL y los
  // deja en los inputs ocultos del formulario, si existen en esta página.
  var params = new URLSearchParams(location.search);
  ['utm_source', 'utm_campaign', 'utm_content'].forEach(function (key) {
    var input = document.getElementById('field-' + key);
    var val = params.get(key);
    if (input && val) input.value = val;
  });

  // Botón "Guardar mi proyecto": oculta la invitación y muestra el formulario.
  var openBtn = document.getElementById('gateOpenBtn');
  var prompt = document.getElementById('gatePrompt');
  var form = document.getElementById('gateForm');
  if (openBtn && prompt && form) {
    openBtn.addEventListener('click', function () {
      prompt.style.display = 'none';
      form.classList.add('is-open');
      var firstField = form.querySelector('input[type="text"], input[type="email"]');
      if (firstField) firstField.focus();
    });
  }
})();
